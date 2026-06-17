# Erturk Lab — Public Website

Modern lab website with 6 appearance themes and **Hire Agent Portal Connection** for live job listings and applications.

Part of the [HR Agent workspace](../README.md). Requires [`hire-agent/`](../hire-agent/) running for `/jobs` and application intake.

## Quick start (Docker — recommended)

No **pnpm/npm** required on the host.

> **Note:** `make` commands require Xcode Command Line Tools on macOS (`xcode-select --install`).
> If `make` is not available, use the `docker compose` equivalents shown below.

```bash
# 1. Start Hire Agent (port 3000)
cd ../hire-agent
cp .env.example .env          # only needed first time
docker compose up --build -d

# 2. Activate portal connection (no SMTP needed for local dev)
docker compose exec app npx tsx scripts/portal/activate-local.ts
# → writes site_id + public_key directly to ../erturk-lab-web/.env.local

# 3. Start lab site (port 3001)
cd ../erturk-lab-web
docker compose up --build -d
```

Open **[http://localhost:3001](http://localhost:3001)**

Docker connects to Hire Agent at `http://host.docker.internal:3000` automatically (set in `docker-compose.yaml`).

### After changing .env.local

```bash
# Clear Next.js cache and restart (required for env changes to take effect)
docker compose down -v && docker compose up -d
```

### Alternative: npm (if Node is installed on the host)

```bash
npm install
npm run dev
```

Use `HIRE_AGENT_API_URL=http://localhost:3000` in `.env.local`.

## Development

```bash
make dev         # Start dev containers
make stop        # Stop containers
make restart     # Reload after .env.local changes
make logs        # Follow app logs
make shell       # Shell into web container
make build       # Production build check
make clean       # Remove containers + volumes
make sync-deps   # Copy node_modules from Docker volume (IDE TypeScript)
make sync-assets # Re-download images from erturk-lab.com
```

## Portal connection

Jobs and applications are **not** managed manually on this site. They sync from Hire Agent when:

- A job has `status: active` in Hire Agent
- Portal Connection is active with matching allowed domain

Env vars (server-only — never expose `PORTAL_PUBLIC_KEY` to the browser):

```env
HIRE_AGENT_API_URL=http://localhost:3000
PORTAL_SITE_ID=site_...
PORTAL_PUBLIC_KEY=pk_...
PORTAL_ORIGIN=http://localhost:3001
```

Shared template: [`../shared/portal-client/`](../shared/portal-client/) (copy into new lab sites)

Quick local portal activation helper (from Hire Agent):

```bash
cd ../hire-agent && npx tsx scripts/portal/activate-local.ts
```

## Content & assets

Static copy lives in `src/content/site.json`; team profiles in `src/content/team.json` (individual pages at `/team/[slug]`). Publications metadata is synced into `src/lib/publications.ts`. Images are **stored locally** under `public/images/` (not loaded from the legacy WordPress site at runtime).

| Folder | Contents |
|--------|----------|
| `public/images/showcase/` | Hero, technologies, publications, science art |
| `public/images/team/` | Team member photos |
| `public/logos/` | Helmholtz / LMU partner logos |
| `public/videos/projects/` | Project supplementary movies (~6 GB — **not in git**) |

To re-fetch images from erturk-lab.com (e.g. after adding new URLs to `site.json`):

```bash
make sync-assets
```

## Project videos

Project supplementary movies (~6 GB, 87 files) are **excluded from git** (GitHub 100 MB file limit). They are re-downloadable from upstream sources via manifest:

```bash
bash scripts/sync-disco-media.sh
```

Manifest: [`scripts/disco-download-manifest.txt`](scripts/disco-download-manifest.txt)  
Regenerate manifest: `python3 scripts/generate-project-media.py`

After cloning the repo, run the sync script before testing project pages with local video playback. See **[../RESTORE.md](../RESTORE.md)** for full restore steps.

## Content scripts

Maintenance scripts in `scripts/` (run from this directory):

| Script | Purpose |
|--------|---------|
| `sync-disco-media.sh` | Download project videos from discotechnologies.org |
| `sync-assets.sh` | Download images from legacy erturk-lab.com |
| `sync-scholar-publications.py` | Import publications from Google Scholar |
| `sync-team-publication-authors.py` | Link team members to publication authors |
| `build-team-json.py` | Rebuild `src/content/team.json` |
| `audit-team-profiles.py` | Validate team profile data |

## Project structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI components (site header, galleries, forms)
├── content/          # site.json, team.json, project-media.json
└── lib/              # publications, projects, team, portal-client

public/
├── images/           # Local images (in git)
├── logos/            # Partner logos (in git)
└── videos/           # Project videos (not in git — sync script)
```

## Themes

Obsidian · Daylight · Midnight · Slate · Ember · Paper — persisted in `localStorage`.

## Pages

| Route | Source |
|-------|--------|
| `/`, `/research`, `/team`, `/publications`, … | `src/content/site.json` + synced data |
| `/jobs`, `/jobs/[slug]` | Hire Agent Portal API |
| `/team/[slug]` | `src/content/team.json` |

