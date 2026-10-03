import {
  Mountain, Landmark, Waves, MapPin, Timer, Clock, Hourglass, DoorOpen, Route, Map, Gauge, Users, Plane,
  MonitorCheck, CheckCircle2, Luggage, TrainFront, AlarmClock, ShieldCheck, Signpost, SprayCan, Armchair,
  Snowflake, PartyPopper, UserCheck,
} from 'lucide-react';

// Maps the icon names used in data/content.js to lucide icons.
const MAP = {
  mountain: Mountain, temple: Landmark, landmark: Landmark, waves: Waves, pin: MapPin, timer: Timer, clock: Clock,
  hourglass: Hourglass, door: DoorOpen, route: Route, map: Map, gauge: Gauge, users: Users, plane: Plane,
  monitor: MonitorCheck, check: CheckCircle2, luggage: Luggage, train: TrainFront, alarm: AlarmClock,
  shield: ShieldCheck, signpost: Signpost, spray: SprayCan, seat: Armchair, snow: Snowflake, party: PartyPopper,
  chauffeur: UserCheck,
};

export default function Icon({ name, size = 18, className = '' }) {
  const C = MAP[name] || MapPin;
  return <C size={size} className={className} aria-hidden="true" />;
}
