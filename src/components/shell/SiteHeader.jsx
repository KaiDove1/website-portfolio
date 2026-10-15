import content from '../../content/content.json';
import { pageHref, usePage } from '../../hooks/usePage';

/**
 * Top-left header inside the frame: the name, the one-line label and the vertical
 * page list. Reads `site.name`, `site.label` and `nav` from content.json. The item for
 * the current page (from the URL hash via usePage) hides its text and shows a dot in
 * its place, the same way the reference site marks "you are here". That link is also
 * taken out of the tab order: it is invisible, so a focus stop there would show no ring.
 */
const LINK =
  'inline-block transition-opacity duration-[400ms] ease-smooth motion-reduce:transition-none hover:opacity-25 focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-4';
const DOT =
  'absolute left-0 -top-px text-[14px] leading-none transition-opacity duration-[400ms] ease-smooth motion-reduce:transition-none';

export default function SiteHeader() {
  const page = usePage();
  const { site, nav } = content;

  return (
    <header className="absolute z-40 top-[calc(var(--pad)*2)] left-[calc(var(--pad)*2)] mix-blend-difference text-white whitespace-nowrap">
      <h1 className="-mt-[0.1em] -ml-[0.04em] text-[30px] xl:text-[60px] font-extralight leading-none mono:tracking-[-0.04em]">
        {site.name}
      </h1>
      <p className="mt-[5px] font-light">{site.label}</p>

      <nav aria-label="Site" className="mt-[54px]">
        <ul className="flex flex-col gap-y-[15px]">
          {nav.map(({ id, label }) => {
            const active = id === page;
            return (
              <li key={id} className="relative">
                <a
                  href={pageHref(id)}
                  aria-current={active ? 'page' : undefined}
                  tabIndex={active ? -1 : undefined}
                  className={`${LINK} ${active ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                >
                  {label}
                </a>
                <span aria-hidden="true" className={`${DOT} ${active ? 'opacity-100' : 'opacity-0'}`}>
                  {'●'}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
