# aref-afzali-site

Personal website at arefafzali.github.io.

## Stack

- Astro 5 (static)
- TypeScript
- Fraunces + JetBrains Mono, self-hosted via `@fontsource*`
- Notion-backed Notes via `@notionhq/client` + `notion-to-md`
- Playwright + axe for smoke and a11y tests
- GitHub Pages for hosting

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

Notes render empty without Notion credentials set. To wire them:

```bash
cp .env.example .env
# fill in NOTION_TOKEN and NOTION_NOTES_DATABASE_ID
```

## Publishing a note

1. Create a page in the Notion "Notes" database.
2. Fill `Title`, `Dek` (optional), `Date`, check `Published`.
3. Trigger a site rebuild — either push a commit or run the "Deploy site" Action manually (`workflow_dispatch`).

The Notion database needs these properties:

| Property  | Type     | Required |
| --------- | -------- | -------- |
| Title     | Title    | yes      |
| Published | Checkbox | yes      |
| Date      | Date     | yes      |
| Slug      | Text     | no (derived from Title if absent) |
| Dek       | Text     | no       |

## Tests

```bash
npm test           # unit tests (vitest)
npm run e2e        # Playwright smoke + a11y (9 tests)
npm run check      # Astro + TypeScript check
```

## Deploy

Pushes to `master` trigger a build-and-deploy via GitHub Actions.
Required repository secrets: `NOTION_TOKEN`, `NOTION_NOTES_DATABASE_ID`.
Build fails early if either is missing.
