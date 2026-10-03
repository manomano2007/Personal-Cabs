import { useState } from 'react';

// <img> that falls back to a neutral placeholder if the file is missing,
// so layouts never collapse while real photos are being added to /public/images.
export default function SmartImage({ src, alt = '', className = '', style, position = 'center', ...rest }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? '/images/placeholder.svg' : src}
      alt={alt}
      className={className}
      style={{ objectFit: 'cover', objectPosition: position, ...style }}
      onError={() => setFailed(true)}
      loading="lazy"
      {...rest}
    />
  );
}
