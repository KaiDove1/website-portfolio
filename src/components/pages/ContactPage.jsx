/**
 * ContactPage: contact links as ArrowLinks, stacked bottom-right in the frame.
 * Reads contact.links from content.json. The mailto link opens in place;
 * external links open in a new tab (handled by ArrowLink).
 */
import content from '../../content/content.json';
import ArrowLink from '../ui/ArrowLink.jsx';

export default function ContactPage() {
  return (
    <div className="relative min-h-full w-full">
      <ul className="absolute right-[calc(var(--pad)*2)] bottom-[calc(var(--pad)*2)] flex flex-col gap-y-[1em] text-right whitespace-nowrap">
        {content.contact.links.map((link) => (
          <li key={link.label}>
            <ArrowLink {...link} className="block" />
          </li>
        ))}
      </ul>
    </div>
  );
}
