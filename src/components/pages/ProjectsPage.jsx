/**
 * ProjectsPage: right-aligned list of big thin project titles, each with a bold
 * 12px info line. Reads `projects` from content.json. The title links to
 * demoUrl || githubUrl; when both exist a GitHub ArrowLink (label from
 * site.labels.github) is appended to the info line. `summary` is the item's
 * note, revealed under the info line on hover or keyboard focus, and `preview`
 * (an image path in public/) is shown by the Shell's PreviewLayer at the same
 * moment; `details` is not rendered yet.
 *
 * Also exports TitleList, the shared layout used by ExperiencePage.
 */
import { useEffect } from 'react';
import content from '../../content/content.json';
import { useSetPreview } from '../../context/PreviewContext.jsx';
import ArrowLink, { linkProps } from '../ui/ArrowLink.jsx';

const FOCUS = 'focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-4';
const FADE = 'transition-opacity duration-[400ms] ease-smooth hover:opacity-25 motion-reduce:transition-none';

/**
 * Shared list look: items = [{ key, title: node, info: node, note?: string, preview?: string }].
 * Includes the page root. Titles scale with the viewport (6.5vw, capped at 60px) and may wrap when a title
 * is longer than the frame; every row keeps ~120px clear on the left so the rows that share
 * height with the nav column on small screens never run into it.
 *
 * `note` opens under the info line while the row is hovered or holds keyboard focus, by
 * animating the wrapper's grid row from 0fr to 1fr. Touch screens have no hover, so there
 * (pointer-coarse) it is always open. Screen readers read it either way.
 * `preview` is handed to the Shell on the same hover/focus and cleared on leave, blur and
 * unmount, so a screenshot never outlives the page.
 */
export function TitleList({ items }) {
  const setPreview = useSetPreview();
  useEffect(() => () => setPreview(null), [setPreview]);

  return (
    <div className="relative min-h-full w-full">
      <section className="pt-[calc(var(--pad)*2+96px)] xl:pt-[calc(var(--pad)*2+125px)] px-[calc(var(--pad)*2)] pb-[calc(var(--pad)*2)] text-right">
        <ul className="flex flex-col items-end gap-y-[30px] md:gap-y-[45px]">
          {items.map(({ key, title, info, note, preview }) => (
            <li
              key={key}
              className="group max-w-[calc(100%-120px)]"
              {...(preview && {
                onMouseEnter: () => setPreview(preview),
                onMouseLeave: () => setPreview(null),
                onFocus: () => setPreview(preview),
                onBlur: () => setPreview(null),
              })}
            >
              <h2 className="font-extralight text-[clamp(22px,6.5vw,60px)] leading-[0.95] text-balance [text-box:trim-both_cap_alphabetic] mono:tracking-[-0.04em]">
                {title}
              </h2>
              <p className="mt-[2vw] md:mt-[15px] leading-normal">{info}</p>
              {note && (
                <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-[600ms] ease-smooth group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 pointer-coarse:grid-rows-[1fr] pointer-coarse:opacity-100 motion-reduce:transition-none">
                  <p className="overflow-hidden">
                    <span className="ml-auto block max-w-[34ch] pt-[8px] font-normal leading-normal text-balance">{note}</span>
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  const items = content.projects.map(({ id, name, year, stack, summary, preview, demoUrl, githubUrl }) => {
    const primary = demoUrl || githubUrl;
    const title = primary ? (
      <a {...linkProps({ href: primary })} className={`${FADE} ${FOCUS}`}>
        {name}
      </a>
    ) : (
      name
    );
    const meta = [year, stack].filter(Boolean).join(' / ');
    const info =
      demoUrl && githubUrl ? (
        <>
          {meta}
          {' / '}
          <ArrowLink label={content.site.labels.github} href={githubUrl} />
        </>
      ) : (
        meta
      );
    return { key: id, title, info, note: summary, preview };
  });

  return <TitleList items={items} />;
}
