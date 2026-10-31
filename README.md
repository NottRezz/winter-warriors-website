# Raiders Winter Warriors

Website for the Raiders Winter Warriors U13 hockey tournament, November 28–29, 2026 at Crowfoot Arena, Calgary.

Built with Next.js, Tailwind CSS and Motion.

```bash
npm install
npm run dev
```

## Hosting

The site is hosted on GitHub Pages. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes it, usually within a few minutes. If the build fails, the last working version stays live.

To set it up, push this project to GitHub, then go to **Settings > Pages** and set **Source** to **GitHub Actions**. Don't use **Deploy from a branch**: that publishes this README as a plain page instead of building the site. The workflow works out the `/repo-name/` sub-path by itself, and also works with a custom domain.

To let the site owner publish, add them under **Settings > Collaborators** with write access. On a free GitHub plan the repository must be public for Pages to work, so everything committed, including earlier versions, can be seen by anyone.

To build locally, use `npm run build` rather than `npx next build`, so the prefetch files end up where the site expects them. It writes the static site to `out/`.

## Updating content

Everything is in [`src/data/tournament.ts`](src/data/tournament.ts).

**The site currently contains made-up sample content.** Replace it with the real details, then set `tournament.sampleData` to `false` to remove the notice at the top of every page. An empty value or list shows a "coming soon" card on that page instead.

| Content | Field |
| --- | --- |
| Contact email | `tournament.contactEmail` |
| Rosters and staff | `teams[].roster`, `teams[].staff` |
| Rules | `rules` |
| Awards | `awards` |
| 50/50 link and raffle prizes | `raffle` |
| Sponsors | `sponsors` (put logos in `public/`) |
| Points system | `tournament.scoring` |

## Live scores from a Google Sheet

Scores can be updated during the tournament without touching the code:

1. Import [`docs/schedule-template.csv`](docs/schedule-template.csv) into a new Google Sheet and fill in the games. Keep the column headers as they are.
2. In the sheet, go to **File > Share > Publish to web**, pick the schedule tab and **Comma-separated values (.csv)**, then publish.
3. Paste the link into `tournament.scheduleCsvUrl`, then rebuild and upload the site once.

From then on, typing scores into the sheet updates the site, usually within a few minutes. Google delays published sheets slightly, and open pages check for changes once a minute.

Team names only need to contain the team (`Raiders`, `Pirates`, `Knights` or `Wolverines`). Use a label such as `1st Place` until a final is decided. Standings count round robin games only.

Without a sheet, add games to the `games` list in the data file instead.

## Logos

Source files are in `assets/logos/`. To use a better version, replace the file with the same name and run:

```bash
npm run logos
```

This regenerates the images in `public/logos/`, the favicon and the social sharing image. The Winter Warriors source is low resolution (460×327), so a larger original would sharpen the hero. The Wolverines logo is 182×180 for the same reason.
