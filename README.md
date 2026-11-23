# Raiders Winter Warriors

Website for the Raiders Winter Warriors U13-5 hockey tournament, November 28–29, 2026 at Crowfoot Arena, Calgary.

Built with Next.js, Tailwind CSS and Motion.

```bash
npm install
npm run dev
```

## Hosting

**This GitHub repository is public, and it publishes the tournament website.** Anyone can read it, including earlier versions of its files. It holds only what appears on the website. Never commit birthdates, addresses, phone numbers, parent details, registration numbers, spreadsheets or other private documents.

The website is hosted on Vercel, which builds and publishes every push to `main`. The pages are built ahead of time; `/api` handles the live scores and the scorekeeper login.

### Setting up the Vercel project

1. Import this repository in Vercel. The defaults (Next.js, `npm run build`) are right.
2. **Storage > Create Database > Upstash for Redis**, free plan, connected to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`, where the scores are kept.
3. **Settings > Environment Variables**, add:
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD`, the one login the scorekeepers share.
   - `NEXT_PUBLIC_SITE_URL`, the live address, for example `https://winter-warriors.vercel.app`, so social media previews find the sharing image.
4. Redeploy so the variables take effect.

The login lives in Vercel rather than in the code because this repository is public. Changing `ADMIN_PASSWORD` and redeploying signs every scorekeeper out.

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

## Live scores: the scorekeeper panel

Scorekeepers go to `/admin` on the live site and sign in with the shared login. Every game is listed by day, with:

- **Upcoming / Live / Final.** A live game shows its running score and an "On now" badge. Only **Final** games count in the standings, and a game can't be marked final without both scores.
- **− and +** beside each team for goals, then **Save**. Each game saves on its own, so two scorekeepers can work on different games at once.
- **Penalty minutes, note and game details**: PIM (used for tie-breaks), a note shown on the game such as "Won in a shootout", and the day, time and stage.
- Team pickers, to put the right teams into the finals once the round robin is done. The game then appears on both teams' pages.
- **Add a game** and **Remove game**, for schedule changes, and **Reset to the original schedule**, which erases every score.

Open pages pick up changes within about 20 seconds. If the scores can't be reached, the site keeps the last ones it loaded and tries again.

Until something is saved, the site shows the `games` list from the data file. After the first save the panel is the source of truth, so change the schedule there, not in the data file (or use **Reset** to reload the data file's games).

Running `npm run dev` without the Redis variables keeps scores in memory, so the panel can be tried locally. Put `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local` for that.

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
