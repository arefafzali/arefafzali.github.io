import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@notionhq/client', () => {
  const queryImpl = vi.fn();
  class Client {
    databases = { query: queryImpl };
    constructor() {}
  }
  return { Client, __queryImpl: queryImpl };
});

vi.mock('notion-to-md', () => {
  class NotionToMarkdown {
    constructor() {}
    async pageToMarkdown() { return [{ parent: 'body', children: [] }]; }
    toMarkdownString(_: unknown) { return { parent: '# sample body' }; }
  }
  return { NotionToMarkdown };
});

import { fetchPublishedNotes } from './notion';
import * as notion from '@notionhq/client';

describe('fetchPublishedNotes', () => {
  beforeEach(() => {
    (notion as any).__queryImpl.mockReset();
  });

  it('returns only pages where Published = true, mapped to NoteEntry shape', async () => {
    (notion as any).__queryImpl.mockResolvedValue({
      results: [
        {
          id: 'p1',
          last_edited_time: '2026-04-01T12:00:00Z',
          properties: {
            Title: { type: 'title', title: [{ plain_text: 'First note' }] },
            Slug:  { type: 'rich_text', rich_text: [{ plain_text: 'first-note' }] },
            Published: { type: 'checkbox', checkbox: true },
            Date: { type: 'date', date: { start: '2026-04-01' } },
            Dek:  { type: 'rich_text', rich_text: [{ plain_text: 'A short dek.' }] }
          }
        }
      ],
      has_more: false,
      next_cursor: null
    });

    const notes = await fetchPublishedNotes({ token: 't', databaseId: 'db' });
    expect(notes).toHaveLength(1);
    expect(notes[0]).toMatchObject({
      id: 'p1',
      slug: 'first-note',
      title: 'First note',
      dek: 'A short dek.',
      date: '2026-04-01',
      body: '# sample body'
    });
  });

  it('returns [] when Notion returns no results', async () => {
    (notion as any).__queryImpl.mockResolvedValue({ results: [], has_more: false, next_cursor: null });
    const notes = await fetchPublishedNotes({ token: 't', databaseId: 'db' });
    expect(notes).toEqual([]);
  });

  it('derives slug from title when Slug property missing', async () => {
    (notion as any).__queryImpl.mockResolvedValue({
      results: [{
        id: 'p2',
        last_edited_time: '2026-04-01T12:00:00Z',
        properties: {
          Title: { type: 'title', title: [{ plain_text: 'My Great Post!' }] },
          Published: { type: 'checkbox', checkbox: true },
          Date: { type: 'date', date: { start: '2026-04-02' } }
        }
      }],
      has_more: false, next_cursor: null
    });
    const notes = await fetchPublishedNotes({ token: 't', databaseId: 'db' });
    expect(notes[0].slug).toBe('my-great-post');
  });
});
