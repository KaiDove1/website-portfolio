import { useEffect, useState } from 'react';

/**
 * Hash-based page state. The site has no router library: the URL hash names the
 * page that renders inside the frame.  "#/"  → home,  "#/projects" → projects, etc.
 * Unknown hashes fall back to home.
 */
export const PAGES = ['home', 'projects', 'experience', 'info', 'contact'];
const HOME = 'home';

function readPage() {
  const raw = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '').toLowerCase();
  return PAGES.includes(raw) ? raw : HOME;
}

export function pageHref(id) {
  return id === HOME ? '#/' : `#/${id}`;
}

export function usePage() {
  const [page, setPage] = useState(readPage);

  useEffect(() => {
    const onHashChange = () => setPage(readPage());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return page;
}
