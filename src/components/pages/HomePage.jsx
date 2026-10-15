/**
 * HomePage: the short bio pinned to the bottom-right corner of the frame.
 * Reads home.bio (one line per entry) from content.json. Lines never wrap on
 * desktop; on phones the block is capped at 60vw and may wrap.
 */
import content from '../../content/content.json';

export default function HomePage() {
  return (
    <div className="relative min-h-full w-full">
      <p className="absolute right-[calc(var(--pad)*2)] bottom-[calc(var(--pad)*2)] whitespace-nowrap max-sm:max-w-[60vw] max-sm:whitespace-normal">
        {content.home.bio.map((line) => (
          <span key={line} className="block leading-normal">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
