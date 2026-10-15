/**
 * ArrowLink: a text link rendered as "{label} ↗" (thin space before the arrow).
 * Props: label, href | file (+ download), className.
 * - http(s) links open in a new tab with rel="noopener noreferrer".
 * - file links resolve against import.meta.env.BASE_URL and carry the download attribute.
 * - mailto: (and any other scheme) links get neither.
 * Color is inherited from the blended page layer, so none is set here.
 */
const FOCUS = 'focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-4';
const FADE = 'transition-opacity duration-[400ms] ease-smooth hover:opacity-25 motion-reduce:transition-none';

/** Anchor attributes for a content.json link object (shared with the project titles). */
export function linkProps({ href, file, download }) {
  if (file) {
    return { href: import.meta.env.BASE_URL + file, download: download || true };
  }
  if (/^https?:\/\//i.test(href || '')) {
    return { href, target: '_blank', rel: 'noopener noreferrer' };
  }
  return { href };
}

export default function ArrowLink({ label, href, file, download, className = '' }) {
  return (
    <a {...linkProps({ href, file, download })} className={`${FADE} ${FOCUS} ${className}`}>
      {label}
      {' ↗'}
    </a>
  );
}
