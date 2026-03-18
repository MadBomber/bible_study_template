# Bible Study Template

A reusable [Bridgetown 2.1](https://www.bridgetownrb.com/) static site template for publishing weekly Bible studies. Content is organized in three layers — **sections** (upper) / **weeks** (middle) / **days** (lower) — and ships with a full set of reader features out of the box.

Built from the same foundation as [A Year at His Feet](https://github.com/MadBomber/ntc1y_guide).

---

## Features

- **Progress tracking** — readers mark days, weeks, and sections complete; stored privately in their browser
- **H.E.A.R. Journal** — per-day journaling (Highlight, Explain, Apply, Respond); stored locally
- **Memory verse pages** — dedicated layout with cross-references and audio support
- **Reading plan** — auto-generated from your data files
- **Read-aloud** — text-to-speech for any page
- **Settings** — light/dark theme, font size, feature toggles
- **Group email sharing** — export journal entries to share with a small group
- **Community discussions** — [Giscus](https://giscus.app/) (GitHub Discussions-backed comments, opt-in)
- **Bible reference linking** — [RefTagger](https://faithlife.com/products/reftagger) auto-links scripture references
- **Responsive navbar** with hamburger menu for mobile
- **FOUC prevention** — theme and feature state applied before first paint

All user data stays in the browser (`localStorage`). Nothing is sent to a server.

---

## Prerequisites

- Ruby 4.0+ with Bundler
- Node.js 18+ with npm
- A GitHub account (for Giscus discussions, optional)

---

## Quick Start

### 1. Clone and install

```sh
git clone https://github.com/MadBomber/bible_study_template.git my_study
cd my_study
bundle install && npm install
```

### 2. Start the development server

```sh
bin/bridgetown start
```

Open `http://localhost:4000`. You will see the sample content.

### 3. Build for production

```sh
bin/bridgetown deploy
```

Output goes to `output/`.

---

## Configuring Your Study

### Site identity — `src/_data/site_metadata.yml`

```yaml
title: "My Bible Study"
tagline: "A short phrase describing the study"
author: "Your Name"
email: you@example.com
description: >-
  A one-paragraph description for search engines and social sharing.
```

### Study structure — `src/_data/study_config.yml`

This is the master configuration. Every section and week count must be reflected here.

```yaml
storage_prefix: "myStudy"   # unique key for localStorage — no spaces

total_weeks: 12             # total weeks across all sections

sections:
  - number: 1
    title: "The Covenants"
    slug: "covenants"       # must match the directory name under src/
    weeks_start: 1
    weeks_end: 6
  - number: 2
    title: "The Kingdom"
    slug: "kingdom"
    weeks_start: 7
    weeks_end: 12
```

**Important:** When you change `storage_prefix`, also update the two string literals in `src/_partials/_head.erb` that reference `bst_settings`. Search for `bst_settings` and replace both occurrences with `<your_prefix>_settings`.

### Week-to-section routing — `src/_data/week_phases.yml`

Maps each week number to the section slug it belongs to. Must stay in sync with `study_config.yml`.

```yaml
1: covenants
2: covenants
# ...
7: kingdom
# ...
```

### Week and day titles — `src/_data/study_titles.json`

Powers the H.E.A.R. Journal header and reading plan. Add one entry per week.

```json
{
  "1": {
    "title": "The Covenant with Noah",
    "days": {
      "1": { "title": "Day 1 Title", "reading": "Genesis 6:1-22" },
      "2": { "title": "Day 2 Title", "reading": "Genesis 7:1-24" },
      "3": { "title": "Day 3 Title", "reading": "Genesis 8:1-22" },
      "4": { "title": "Day 4 Title", "reading": "Genesis 9:1-17" },
      "5": { "title": "Day 5 Title", "reading": "Genesis 9:18-29" }
    }
  }
}
```

---

## Adding Content

### Section directory

Create a directory under `src/` named with your section slug and add an `index.md`:

```
src/covenants/
  index.md
  week-01/
    overview.md
    day-1.md
    day-2.md
    day-3.md
    day-4.md
    day-5.md
    discussion.md
    memory-verse.md
```

### Section index — `src/<slug>/index.md`

```yaml
---
layout: page
title: "Section 1: The Covenants"
section_number: 1
---
```

### Week overview — `src/<slug>/week-NN/overview.md`

```yaml
---
week: 1
title: "The Covenant with Noah"
section: "Section 1: The Covenants"
date_range: "Days 1–5"
chapters:
  - Genesis 6
  - Genesis 7
tags:
  - covenant
  - section-1
layout: page
---
```

### Daily page — `src/<slug>/week-NN/day-N.md`

```yaml
---
week: 1
day: 1
title: "A World Gone Wrong"
reading: "Genesis 6:1-22"
parallel_passages: "Matthew 24:37-39"
section: "Section 1: The Covenants"
tags:
  - noah
  - section-1
layout: page
---
```

Page body sections (use as a starting point):

- `## Reading: <reference>` — link to an audio Bible
- `## Historical Context`
- `## Key Themes`
- `## Connections` — cross-references
- `## Reflection Questions`
- `## Prayer`

### Memory verse — `src/<slug>/week-NN/memory-verse.md`

```yaml
---
week: 1
title: "The Covenant with Noah"
section: "Section 1: The Covenants"
memory_verse: "Genesis 9:13"
verse_text: "I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth."
translation: "NIV"
connections:
  - "Revelation 4:3 — a rainbow around the throne"
  - "2 Peter 2:5 — Noah as a herald of righteousness"
layout: memory_verse
---
```

### Discussion guide — `src/<slug>/week-NN/discussion.md`

```yaml
---
week: 1
title: "Week 1 Discussion"
section: "Section 1: The Covenants"
type: discussion
tags:
  - discussion
  - section-1
layout: page
---
```

### Memory verses index — `src/memory-verses.md`

Add a row for each week:

```markdown
| Week | Verse | Reference |
|------|-------|-----------|
| [1](/covenants/week-01/memory-verse/) | "I have set my rainbow in the clouds…" | Genesis 9:13 (NIV) |
```

---

## Enabling Giscus Discussions

Giscus displays GitHub Discussions as a comment widget on each page. It is opt-in — readers enable it in Settings.

1. Go to [giscus.app](https://giscus.app/) and configure it for your GitHub repo.
2. Copy the values it gives you into `frontend/javascript/discussions.js`:

```javascript
script.setAttribute("data-repo", "YOUR_GITHUB_USERNAME/YOUR_REPO")
script.setAttribute("data-repo-id", "YOUR_REPO_ID")
script.setAttribute("data-category", "Page Comments")
script.setAttribute("data-category-id", "YOUR_CATEGORY_ID")
```

---

## Deploying to GitHub Pages

1. Set `base_path` in `config/initializers.rb` to match your repo name:

```ruby
base_path "/my_study"
```

2. Update `publicPath` in `esbuild.config.js` to match:

```javascript
publicPath: "/my_study/_bridgetown/static"
```

3. Build and push the `output/` directory to your `gh-pages` branch, or configure a GitHub Actions workflow to run `bin/bridgetown deploy`.

---

## Deleting the Sample Content

Once you have added your own content, remove the sample:

1. Delete `src/sample/`
2. Remove the `sample` section from `src/_data/study_config.yml`
3. Remove the `1: sample` entry from `src/_data/week_phases.yml`
4. Clear the sample week from `src/_data/study_titles.json`
5. Update `src/memory-verses.md` to remove the sample row
6. Update `src/index.md` if it references the sample section

---

## Project Structure

```
src/
  _data/
    site_metadata.yml     # site title, author, description
    study_config.yml      # sections, total weeks, storage prefix
    week_phases.yml       # week number → section slug map
    study_titles.json     # week/day titles and readings for journal
  _layouts/
    default.erb           # base layout; injects config JSON for JS
    home.erb              # homepage; loops sections from config
    page.erb              # weekly/daily pages with prev/next nav
    memory_verse.erb      # memory verse layout with audio widget
  _partials/
    _head.erb             # meta, CSS, FOUC-prevention script
    _footer.erb
  _components/shared/
    navbar.erb / navbar.rb
  <section-slug>/
    index.md              # section overview page
    week-NN/
      overview.md
      day-1.md … day-5.md
      discussion.md
      memory-verse.md
  index.md                # homepage
  memory-verses.md        # all memory verses table
  reading-plan.erb        # auto-generated reading plan
  hear-journal.erb        # H.E.A.R. journal app page
  settings.erb            # reader settings page

frontend/
  javascript/
    index.js              # entry point; imports all modules
    progress.js           # progress tracking
    hear-journal.js       # journal UI and localStorage
    settings.js           # theme, font, feature toggles
    memory-verse-audio.js # audio playback for memory verses
    page-speak.js         # read-aloud
    group-share.js        # group email export
    discussions.js        # Giscus integration
    hamburger-menu.js     # mobile nav
  styles/
    index.css             # main stylesheet
    syntax-highlighting.css
```

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `bin/bridgetown start` | Development server at `localhost:4000` |
| `bin/bridgetown deploy` | Production build to `output/` |
| `bin/bridgetown console` | Interactive console with site loaded |
| `npm run esbuild` | Build frontend assets (minified) |
| `npm run esbuild-dev` | Build frontend assets in watch mode |
| `rake clean` | Remove build artifacts |
