/**
 * PreviewLayer: a project screenshot pinned bottom-left inside the frame, shown while a
 * project with a `preview` is hovered or focused (see TitleList). It lives outside the
 * blended page layer on purpose: under `mix-blend-difference` a photo would render as a
 * colour negative. Only at xl with a fine pointer; below that the titles fill the left side,
 * and touch screens cannot hover. The last image stays mounted while it fades out.
 */
import { useState } from 'react';

export default function PreviewLayer({ src }) {
  const [shown, setShown] = useState(src);
  if (src && src !== shown) setShown(src);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-15 left-[calc(var(--pad)*2)] bottom-[calc(var(--pad)*2)] hidden w-[min(30vw,520px)] transition-opacity duration-[600ms] ease-smooth motion-reduce:transition-none xl:block pointer-coarse:hidden ${
        src ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {shown && <img src={import.meta.env.BASE_URL + shown} alt="" className="block h-auto w-full" />}
    </div>
  );
}
