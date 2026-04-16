import rss from '@astrojs/rss';
import { NOTES } from '../data/notes.js';

export async function GET(context) {
  return rss({
    title: 'Raksha Tated — Notes',
    description: 'Notes on design, code, and everything in between.',
    site: context.site,
    items: NOTES.map((note) => {
      const iso = note.sortDate
        ? String(note.sortDate).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
        : undefined;
      return {
        title: note.title,
        description: note.preview,
        link: `/notes/${note.slug}/`,
        pubDate: iso ? new Date(iso) : undefined,
        categories: note.tags,
      };
    }),
    customData: '<language>en-us</language>',
  });
}
