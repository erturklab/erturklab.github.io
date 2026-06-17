# Ertürk Lab — Public Website

Modern lab website for the [Ertürk Lab](https://erturklab.github.io) at Helmholtz Munich / LMU. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Deployed as a fully static site on GitHub Pages.

## Live site

[https://erturklab.github.io](https://erturklab.github.io)

## Quick start (Docker — recommended)

```bash
docker compose up --build -d
```

Open **[http://localhost:3001](http://localhost:3001)**

### Alternative: npm

```bash
npm install
npm run dev
```

## Development commands

```bash
make dev         # Start dev container
make stop        # Stop container
make restart     # Restart container
make logs        # Follow app logs
make shell       # Shell into web container
make build       # Static export build check
make clean       # Remove containers + volumes
make sync-deps   # Copy node_modules from Docker volume (IDE TypeScript)
make sync-assets # Re-download images from erturk-lab.com
```

## Deployment

The site is deployed to **GitHub Pages** via GitHub Actions on every push to `main`.

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

To enable deployment on a new repo:
1. Go to **Settings → Pages → Source** and select **GitHub Actions**
2. Push to `main` — the workflow builds and deploys automatically

## Content & assets

| Folder | Contents |
|--------|----------|
| `src/content/site.json` | Lab identity, technologies, publications, science art |
| `src/content/team.json` | Team member profiles |
| `src/content/project-media.json` | Project media entries |
| `public/images/showcase/` | Hero and technology images |
| `public/images/team/` | Team member photos |
| `public/logos/` | Helmholtz Munich / LMU logos |

## Content scripts

Maintenance scripts in `scripts/` (run from this directory):

| Script | Purpose |
|--------|---------|
| `sync-assets.sh` | Download images from legacy erturk-lab.com |
| `sync-scholar-publications.py` | Import publications from Google Scholar |
| `sync-team-publication-authors.py` | Link team members to publication authors |
| `build-team-json.py` | Rebuild `src/content/team.json` |
| `audit-team-profiles.py` | Validate team profile data |

## Project structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI components (header, galleries, video players)
├── content/          # site.json, team.json, project-media.json
└── lib/              # publications, projects, team utilities

public/
├── images/           # Local images (in git)
└── logos/            # Partner logos (in git)
```

## Pages

| Route | Content source |
|-------|----------------|
| `/` | `site.json` hero, technologies, publications |
| `/research`, `/research/projects` | `site.json` technologies |
| `/research/projects/[slug]` | `site.json` + `project-media.json` |
| `/team`, `/team/[slug]` | `team.json` |
| `/publications` | `site.json` publications |
| `/science-art` | `site.json` scienceArt |
| `/jobs` | Static contact page |
| `/news`, `/contact`, `/imprint`, `/privacy` | Static pages |

## Themes

Obsidian · Daylight · Midnight · Slate · Ember · Paper — persisted in `localStorage`.
