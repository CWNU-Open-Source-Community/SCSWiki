import { createContentLoader } from 'vitepress';
import { eventSchema } from './event-schema';
import type { EventItem } from './events';

declare const data: EventItem[];
export { data };

export default createContentLoader('events/*.md', {
  transform(pages): EventItem[] {
    return pages
      .filter((page) => page.frontmatter.event)
      .map((page) => ({
        ...eventSchema.parse(page.frontmatter.event),
        title: page.frontmatter.title,
        description: page.frontmatter.description,
        url: page.url,
      }))
      .sort((a, b) => a.order - b.order);
  },
});
