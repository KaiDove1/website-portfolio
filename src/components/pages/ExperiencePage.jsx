/**
 * ExperiencePage: work and education entries in the same big-title list as
 * ProjectsPage. Reads `experience` (already newest-first) from content.json.
 * Titles are plain text; the info line is "period / org".
 */
import content from '../../content/content.json';
import { TitleList } from './ProjectsPage.jsx';

export default function ExperiencePage() {
  const items = content.experience.map(({ title, org, period }) => ({
    key: `${title}|${org}|${period}`,
    title,
    info: `${period} / ${org}`,
  }));

  return <TitleList items={items} />;
}
