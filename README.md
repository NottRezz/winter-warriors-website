# Raiders Winter Warriors

Website for the Raiders Winter Warriors U13-5 hockey tournament, November 28–29, 2026 at Crowfoot Arena, Calgary.

Built with Next.js, Tailwind CSS and Motion.

```bash
npm install
npm run dev
```

## Hosting

**This GitHub repository is public, and it publishes the tournament website.** Anyone can read it, including earlier versions of its files. It holds only what appears on the website. Never commit birthdates, addresses, phone numbers, parent details, registration numbers, spreadsheets or other private documents.

The website is live at https://nottrezz.github.io/winter-warriors-website/. It's a static site, so it can also go on any other web host:

1. Set `NEXT_PUBLIC_SITE_URL` to the live address, for example `https://example.com`, so social media previews can find the sharing image. If the site will live in a sub-folder, also set `NEXT_PUBLIC_BASE_PATH`, for example `/tournament`.
2. Run `npm run build`, not `npx next build`, so the prefetch files end up where the site expects them.
3. Upload everything inside `out/` to the host.

### GitHub Pages

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which publishes the website to GitHub Pages. In **Settings > Pages**, set **Source** to **GitHub Actions**. **Deploy from a branch** publishes this README as a plain page instead of building the site.

## Updating content

Everything is in [`src/data/tournament.ts`](src/data/tournament.ts).

Set `tournament.sampleData` to `true` to show a preview notice at the top of every page. An empty value or list shows a "coming soon" card on that page instead.

| Content | Field |
| --- | --- |
| Contact email | `tournament.contactEmail` |
| Rosters and staff | `teams[].roster`, `teams[].staff` |
| Rules | `rules` |
| Awards | `awards` (badges are in `assets/awards/`, see [Logos](#logos)) |
| 50/50 link and raffle prizes | `raffle` (`feature`, `cash` and `draws`, artwork is in `assets/raffle/`) |
| Sponsors | `sponsors` (see [Sponsor logos](#sponsor-logos)) |
| Points system | `tournament.scoring` |

## Live scores from a Google Sheet

Scores can be updated during the tournament without touching the code:

1. Import [`docs/schedule-template.csv`](docs/schedule-template.csv), which already has all the games, into a new Google Sheet. Keep the column headers as they are.
2. In the sheet, go to **File > Share > Publish to web**, pick the schedule tab and **Comma-separated values (.csv)**, then publish.
3. Paste the link into `tournament.scheduleCsvUrl`, then rebuild and upload the site once.

From then on, typing scores into the sheet updates the site, usually within a few minutes. Google delays published sheets slightly, and open pages check for changes once a minute.

The Schedule, the standings and the Games section on every team page all read the same sheet. During the tournament:

- Enter both scores when a game is over. A game counts as finished, and counts in the standings, as soon as both are filled in, so don't type running scores.
- If a final goes to a shootout, give the winner one extra goal, so the winner is highlighted.
- Once the finals are decided, replace `TBD` in the `home` and `away` columns. The game then appears on both teams' pages.
- If the sheet can't be reached, the site keeps the last scores it loaded and tries again.

Team names only need to contain the team (`Raiders`, `Pirates`, `Knights` or `Wolverines`). Use a label such as `1st Place` until a final is decided. Standings count round robin games only.

Without a sheet, add games to the `games` list in the data file instead.

## Sponsor logos

1. Put the original file in `assets/sponsors/`, for example `acme.png`.
2. Add it to `sponsors` in the data file: `{ name: "Acme", tier: 3, logo: "/sponsors/acme.webp" }`.
3. Run `npm run sponsors`, which trims and balances every logo and saves it to `public/sponsors/`.

Tier 1 is the biggest. For a white logo, add a dark `background`, for example `"#2a1a38"`. If a logo still looks too big or small, add a `scale` such as `1.1`. Run the script again after changing a tier, background or scale. Leave out `logo` to show the sponsor's name instead.

## Logos

Source files are in `assets/logos/`, and award badges are in `assets/awards/`. To use a better version, replace the file with the same name and run:

```bash
npm run logos
```

This regenerates the images in `public/logos/`, the favicon and the social sharing image. The Winter Warriors source is low resolution (460×327), so a larger original would sharpen the hero. The Wolverines logo is 182×180 for the same reason.
