import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

export interface NoteEntry {
  id: string;
  slug: string;
  title: string;
  dek: string;
  date: string;          // ISO date (YYYY-MM-DD)
  lastEdited: string;    // ISO datetime
  body: string;          // markdown body
}

export interface FetchOpts {
  token: string;
  databaseId: string;
}

function plain(prop: any): string {
  if (!prop) return '';
  if (prop.type === 'title') return (prop.title ?? []).map((t: any) => t.plain_text).join('');
  if (prop.type === 'rich_text') return (prop.rich_text ?? []).map((t: any) => t.plain_text).join('');
  return '';
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function fetchPublishedNotes(opts: FetchOpts): Promise<NoteEntry[]> {
  const notion = new Client({ auth: opts.token });
  const n2m = new NotionToMarkdown({ notionClient: notion });

  const notes: NoteEntry[] = [];
  let cursor: string | undefined = undefined;

  do {
    const resp: any = await notion.databases.query({
      database_id: opts.databaseId,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
      start_cursor: cursor
    });

    for (const page of resp.results ?? []) {
      const title = plain(page.properties?.Title);
      const slug =
        plain(page.properties?.Slug) ||
        slugify(title);
      const dek = plain(page.properties?.Dek);
      const date = page.properties?.Date?.date?.start ?? '';

      const blocks = await n2m.pageToMarkdown(page.id);
      const md = n2m.toMarkdownString(blocks);

      notes.push({
        id: page.id,
        slug,
        title,
        dek,
        date,
        lastEdited: page.last_edited_time,
        body: md.parent ?? ''
      });
    }

    cursor = resp.has_more ? resp.next_cursor : undefined;
  } while (cursor);

  return notes;
}
