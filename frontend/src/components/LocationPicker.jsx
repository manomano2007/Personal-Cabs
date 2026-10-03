import { useEffect, useRef, useState } from 'react';
import { LocateFixed, Map as MapIcon, Loader2, X, AlertCircle } from 'lucide-react';

// Free OpenStreetMap stack: Nominatim (search + reverse geocoding) and Leaflet (map).
// No API key needed. Results are limited to Tamil Nadu, matching the service area.
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const TN_VIEWBOX = '76.0,13.6,80.4,8.0'; // left,top,right,bottom
const TN_CENTER = [10.9, 78.4];

const isTamilNadu = (r) => r?.address?.state === 'Tamil Nadu';
const toLabel = (r, max) => String(r.display_name || '').replace(/, India$/, '').slice(0, max);
const OUT_OF_TN = 'That spot is outside Tamil Nadu. Please choose a place within Tamil Nadu.';

async function reverseGeocode(lat, lon, signal) {
  const url = `${NOMINATIM}/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=en&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Could not read that location. Please try again.');
  return res.json();
}

export default function LocationPicker({ id, name, value, onText, placeholder, maxLength = 200, currentLabel = 'Use my current location' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const typed = useRef(false);        // true only when the user typed (not when we filled the value)
  const wrapRef = useRef(null);
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletRef = useRef(null);
  const lastCoords = useRef(null);

  // Autocomplete while typing (debounced to stay polite to the free Nominatim service).
  useEffect(() => {
    if (!typed.current) return undefined;
    const q = String(value || '').trim();
    if (q.length < 3) { setSuggestions([]); return undefined; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const url = `${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=in&bounded=1&viewbox=${TN_VIEWBOX}&accept-language=en&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) return;
        const rows = (await res.json()).filter(isTamilNadu);
        setSuggestions(rows);
        setOpen(rows.length > 0);
      } catch { /* aborted or offline: the typed text is still usable */ }
    }, 600);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [value]);

  // Close the suggestion list when clicking elsewhere.
  useEffect(() => {
    const away = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  const fill = (text) => { typed.current = false; setSuggestions([]); setOpen(false); setNote(''); onText(text); };

  const applyPlace = (r) => {
    if (!isTamilNadu(r)) { setNote(OUT_OF_TN); return false; }
    fill(toLabel(r, maxLength));
    return true;
  };

  async function useCurrent() {
    setNote('');
    if (!navigator.geolocation) { setNote('Your browser does not support location access. Please type the place or use the map.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        lastCoords.current = [latitude, longitude];
        const r = await reverseGeocode(latitude, longitude);
        if (applyPlace(r) && markerRef.current) moveMarker(latitude, longitude, true);
      } catch (err) {
        setNote(err.message || 'Could not read your location. Please type it instead.');
      } finally { setLocating(false); }
    }, (err) => {
      setLocating(false);
      setNote(err.code === 1
        ? 'Location permission was blocked. Allow location in your browser, or type the place / use the map.'
        : 'Could not get your location. Please type the place or use the map.');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }

  function moveMarker(lat, lon, recenter) {
    if (!mapRef.current || !leafletRef.current) return;
    const L = leafletRef.current;
    if (!markerRef.current) {
      markerRef.current = L.marker([lat, lon], {
        draggable: true,
        icon: L.divIcon({ className: 'locpick-pin', html: '<span></span>', iconSize: [28, 38], iconAnchor: [14, 36] }),
      }).addTo(mapRef.current);
      markerRef.current.on('dragend', () => { const p = markerRef.current.getLatLng(); pickPoint(p.lat, p.lng); });
    } else {
      markerRef.current.setLatLng([lat, lon]);
    }
    if (recenter) mapRef.current.setView([lat, lon], 15);
  }

  async function pickPoint(lat, lon) {
    setBusy(true); setNote('');
    try {
      const r = await reverseGeocode(lat, lon);
      applyPlace(r);
    } catch (err) {
      setNote(err.message || 'Could not read that location.');
    } finally { setBusy(false); }
  }

  // Create / destroy the Leaflet map when the panel opens or closes.
  useEffect(() => {
    if (!mapOpen) return undefined;
    let cancelled = false;
    (async () => {
      const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
      if (cancelled || !mapEl.current) return;
      leafletRef.current = L;
      const start = lastCoords.current || TN_CENTER;
      const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView(start, lastCoords.current ? 15 : 7);
      mapRef.current = map;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);
      if (lastCoords.current) moveMarker(start[0], start[1], false);
      map.on('click', (e) => { moveMarker(e.latlng.lat, e.latlng.lng, false); pickPoint(e.latlng.lat, e.latlng.lng); });
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapOpen]);

  return (
    <div className="locpick" ref={wrapRef}>
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => { typed.current = true; setNote(''); onText(e.target.value); }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />

      {open && suggestions.length > 0 && (
        <ul className="locpick__list" role="listbox">
          {suggestions.map((s) => (
            <li key={s.place_id} role="option">
              <button type="button" onClick={() => applyPlace(s)}>{toLabel(s, 120)}</button>
            </li>
          ))}
        </ul>
      )}

      <div className="locpick__actions">
        <button type="button" className="locpick__btn" onClick={useCurrent} disabled={locating}>
          {locating ? <Loader2 size={14} className="spin" /> : <LocateFixed size={14} />} {locating ? 'Finding you…' : currentLabel}
        </button>
        <button type="button" className="locpick__btn" onClick={() => setMapOpen((o) => !o)} aria-expanded={mapOpen}>
          {mapOpen ? <X size={14} /> : <MapIcon size={14} />} {mapOpen ? 'Close map' : 'Pick on map'}
        </button>
      </div>

      {note && <p className="locpick__note" role="status"><AlertCircle size={13} /> {note}</p>}

      {mapOpen && (
        <div className="locpick__map">
          <div ref={mapEl} className="locpick__canvas" />
          <p className="locpick__tip">{busy ? 'Reading the place name…' : 'Tap the map or drag the pin to choose the exact spot (Tamil Nadu only).'}</p>
        </div>
      )}
    </div>
  );
}
