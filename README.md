# jujich.dev

**English** | [Русский](README.ru.md)

Kuzma Korolev's personal portfolio and résumé website, built with Nuxt 4 and TypeScript and generated as a static site. It presents selected projects, work experience, skills, education, and contact information.

**Live website:** [jujich.dev](https://jujich.dev/) · [Russian version](https://jujich.dev/ru)

## Features

- English and Russian pages with localized navigation, metadata, and downloadable résumé PDFs.
- Project cards with expandable case studies and links to public source repositories.
- A responsive layout with folder-shaped cards, large typography, and an olive accent.
- Scroll animations that respect reduced-motion preferences; the content remains available without JavaScript.
- Static generation, canonical URLs, hreflang metadata, a sitemap, and locally hosted fonts.

The current design was adapted from a Claude Design export. English is served at `/` and Russian at `/ru`. The language switch changes the localized URL; automatic browser-language redirects are disabled. EventMatch appears in both languages. Jujich Services appears only in English, while the Nizhny Novgorod CSM experience and related website links appear only in Russian.

## Local development

Use Node.js 24.11 or later in the 24.x release line, and npm.

```sh
npm ci
npm run dev
```

The development server listens on `127.0.0.1`; its URL is printed in the terminal.

## Checks and static build

```sh
npm test
npm run typecheck
npm run generate
```

The generation command also validates both localized HTML pages, SEO metadata, and public assets. The static output is written to `.output/public/`.

Server configuration and deployment automation are maintained in the original GitLab repository and are excluded from this GitHub copy.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/data/profile.ts` | Localized contact details, experience, education, skills, and other portfolio links. |
| `app/data/projects.ts` | Localized project descriptions, technology stacks, status notes, and experiments. |
| `i18n/locales/en.json`, `i18n/locales/ru.json` | Interface text, accessible labels, headings, and SEO copy. The current layout uses the `redesign` object. |
| `app/pages/index.vue` | Page structure, project ordering, locale selection, mobile navigation, and SEO. |
| `app/components/FolderTab.vue`, `app/components/ProjectFolder.vue` | Folder tabs and project cards with expandable details and repository links. |
| `app/composables/usePortfolioMotion.ts` | Scroll reveals, parallax, technology strips, and card outlines, with locale-change and unmount cleanup. |
| `app/assets/css/main.css` | Styling and responsive layouts. |
| `nuxt.config.ts` | Nuxt, localization, and static generation configuration. |
| `public/` | Images, fonts, icons, résumé PDFs, and other public assets. |

Project data retains the `featured`, `supporting`, and `landing` categories. The main cards are displayed in this order: EventMatch, online learning platform, CRM, and Forma CMS. Jujich Services appears in the English experiments area even though its data category remains `featured`.

The optional `url` field links a project title to its live website; `repositoryUrl` adds a source-code link. When updating shared project facts, update both languages and preserve the distinction between implemented features, prototypes, and planned work.

`ProjectVisual.vue` contains illustrations from the previous design and is no longer rendered on the page. Those illustrations are interface diagrams, not screenshots of the applications. The current design assets are in `public/assets/redesign/`; Manrope fonts are served from `public/assets/fonts/`.

## Résumé PDFs

The website provides separate English and Russian résumés:

- [`public/kuzma-korolev-resume-en.pdf`](public/kuzma-korolev-resume-en.pdf)
- [`public/kuzma-korolev-resume-ru.pdf`](public/kuzma-korolev-resume-ru.pdf)

The hero and footer download the PDF for the current page language. The older `kuzma-korolev-resume.pdf` URL remains a copy of the Russian version. The English résumé omits the CSM experience; the Russian version retains it.

To regenerate the PDFs, use Node.js 24, Python with `reportlab` and `pypdf`, and the Arial and Georgia fonts supplied with macOS. Set `RESUME_FONT_DIR` to use a different font directory.

```sh
python3 scripts/generate-resumes.py
```

The script reads shared site data, generates two two-page PDFs in `output/pdf/`, and copies them into `public/`. After changing résumé content or the generator, inspect the text and rendered layout of all four pages. The checked-in PDFs allow the usual website build to run without Python or system fonts.

The contact email is stored in the shared profile data and synchronized with text and mail links in all three public PDFs. Regenerate the résumés when changing it.

## Content maintenance

Project descriptions were prepared from the owner's résumé and local project materials. Working research notes are excluded from Git and the static output. Keep private addresses, credentials, and internal notes out of `public/` and client-side data.

External links and project availability can change. A past launch does not establish current availability, and project updates should not introduce unverified usage, revenue, or performance claims. Credentials are kept separately and are not required to develop this website.
