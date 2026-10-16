/**
 * InfoPage: three blocks read from content.json `info`.
 *   A  links        (ArrowLinks, one per line)
 *   B  skills       (per group: light label line + bold "a / b / c" line)
 *   C  achievements (per item: light detail line + bold title line)
 * At xl+ the blocks are pinned to the frame (A near the center, B top-right,
 * C bottom-right): the wrapper becomes `display: contents` so each block
 * positions against the page root. B starts level with the nav (+125px, the same
 * offset TitleList uses) so it clears the quick-links icon in the corner. Below xl
 * they flow as one right-aligned column that keeps ~120px clear on the left, so rows
 * that share height with the nav column never run into it (the same compromise the
 * reference makes on phones).
 * Nothing is shown as a heading; each list carries an aria-label from info.headings
 * so screen readers can name the three groups.
 */
import content from '../../content/content.json';
import ArrowLink from '../ui/ArrowLink.jsx';

export default function InfoPage() {
  const { headings, links, skills, achievements } = content.info;

  return (
    <div className="relative min-h-full w-full">
      <div className="pt-[calc(var(--pad)*2+96px)] px-[calc(var(--pad)*2)] pb-[calc(var(--pad)*2)] flex flex-col items-end gap-y-[50px] text-right xl:contents">
        <ul
          aria-label={headings.links}
          className="flex flex-col items-end gap-y-[3px] xl:absolute xl:left-[55%] xl:top-[calc(50%-19px)] xl:items-start xl:text-left"
        >
          {links.map((link) => (
            <li key={link.label}>
              <ArrowLink {...link} />
            </li>
          ))}
        </ul>

        <dl
          aria-label={headings.skills}
          className="max-w-[calc(100%-120px)] leading-normal xl:max-w-[360px] xl:absolute xl:right-[calc(var(--pad)*2)] xl:top-[calc(var(--pad)*2+125px)] xl:text-right"
        >
          {skills.map(({ label, items }) => (
            <div key={label}>
              <dt className="font-normal">{label}</dt>
              <dd>{items.join(' / ')}</dd>
            </div>
          ))}
        </dl>

        <ul
          aria-label={headings.achievements}
          className="max-w-[calc(100%-120px)] leading-normal xl:max-w-none xl:absolute xl:right-[calc(var(--pad)*2)] xl:bottom-[calc(var(--pad)*2)] xl:text-right"
        >
          {achievements.map(({ title, detail }) => (
            <li key={title}>
              <span className="block font-normal">{detail}</span>
              <span className="block">{title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
