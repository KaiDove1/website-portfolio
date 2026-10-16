import content from '../../content/content.json';
import { linkProps } from '../ui/ArrowLink.jsx';

/**
 * Top-right icon links inside the frame, at the same inset as the header (2 × --pad from the
 * top and right edges). Reads `site.quickLinks` ([{ label, href | file, icon }]) and names the
 * list with `site.labels.quickLinks`. Each link shows only its icon and carries its label as
 * aria-label. Icons are inline SVGs filled with currentColor, so they turn white like the header
 * text and read correctly in both themes under the difference blend. An `icon` key missing from
 * ICONS falls back to the label as text, so a new item never renders as an invisible link.
 * `-m-1 p-1` grows each hit area to 28px (32px at xl) without moving the icon off the inset.
 */
const LINK =
  'block -m-1 p-1 transition-opacity duration-[400ms] ease-smooth motion-reduce:transition-none hover:opacity-25 focus-visible:outline-1 focus-visible:outline-white';

// GitHub mark, from Simple Icons (CC0).
function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const ICONS = {
  github: GitHubIcon,
};

export default function QuickLinks() {
  const { quickLinks, labels } = content.site;

  return (
    <ul
      aria-label={labels.quickLinks}
      className="absolute z-40 top-[calc(var(--pad)*2)] right-[calc(var(--pad)*2)] flex gap-x-[15px] mix-blend-difference text-white"
    >
      {quickLinks.map(({ label, icon, ...link }) => {
        const Icon = ICONS[icon];
        return (
          <li key={label}>
            <a {...linkProps(link)} aria-label={Icon ? label : undefined} className={LINK}>
              {Icon ? <Icon className="size-5 xl:size-6" /> : label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
