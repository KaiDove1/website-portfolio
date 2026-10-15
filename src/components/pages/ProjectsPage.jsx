/**
 * ProjectsPage: right-aligned list of big thin project titles, each with a bold
 * 12px info line. Reads `projects` from content.json. The title links to
 * demoUrl || githubUrl; when both exist a GitHub ArrowLink (label from
 * site.labels.github) is appended to the info line. summary/details are
 * intentionally not rendered yet.
 *
 * Also exports TitleList, the shared layout used by ExperiencePage.
 */
import content from '../../content/content.json';
import ArrowLink, { linkProps } from '../ui/ArrowLink.jsx';

const FOCUS = 'focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-4';
const FADE = 'transition-opacity duration-[400ms] ease-smooth hover:opacity-25 motion-reduce:transition-none';

/**
 * Shared list look: items = [{ key, title: node, info: node }]. Includes the page root.
 * Titles scale with the viewport (6.5vw, capped at 60px) and may wrap when a title is
 * longer than the frame; every row keeps ~120px clear on the left so the rows that share
 * height with the nav column on small screens never run into it.
 */
export function TitleList({ items }) {
  return (
    <div className="relative min-h-full w-full">
      <section className="pt-[calc(var(--pad)*2+96px)] xl:pt-[calc(var(--pad)*2+125px)] px-[calc(var(--pad)*2)] pb-[calc(var(--pad)*2)] text-right">
        <ul className="flex flex-col items-end gap-y-[30px] md:gap-y-[45px]">
          {items.map(({ key, title, info }) => (
            <li key={key} className="max-w-[calc(100%-120px)]">
              <h2 className="font-extralight text-[clamp(22px,6.5vw,60px)] leading-[0.95] text-balance [text-box:trim-both_cap_alphabetic] mono:tracking-[-0.04em]">
                {title}
              </h2>
              <p className="mt-[2vw] md:mt-[15px] leading-normal">{info}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  const items = content.projects.map(({ id, name, year, stack, demoUrl, githubUrl }) => {
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
    return { key: id, title, info };
  });

  return <TitleList items={items} />;
}
