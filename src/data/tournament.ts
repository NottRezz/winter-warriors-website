/**
 * All the tournament's content lives here. Fill in a list or a blank value and
 * the matching page switches from its "coming soon" card to the real content.
 */

export type Player = {
  /** Leave blank if there's no number yet. */
  number: string;
  name: string;
};

export type Team = {
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  /** Background the logo was designed on. */
  logoSurface: "light" | "dark";
  /** From the logo. Used on the team's page for the banner and highlights. */
  colours: { main: string; trim: string };
  roster: Player[];
  staff: { name: string; role: string }[];
};

export type Award = {
  /** The small line above the name. */
  series: string;
  name: string;
  description: string;
  logo?: string;
  /** Colour of the light behind the badge. */
  glow?: "ice" | "violet";
};

export type Prize = {
  name: string;
  description: string;
  /** The picture on the prize's card or ticket. A gift box if left out. */
  icon?:
    | "candy"
    | "chef"
    | "clover"
    | "coins"
    | "dining"
    | "drink"
    | "family"
    | "flower"
    | "gift"
    | "golf"
    | "jersey"
    | "sticks"
    | "trophy";
  donor?: string;
  /** Shows the ticket link, once there is one. */
  fiftyFifty?: boolean;
};

/** If the donor matches a sponsor's name, that sponsor's logo is shown. */
export type FeatureDraw = { value: string; name: string; description: string; donor?: string };

export type Sponsor = {
  name: string;
  /** 1 is the biggest sponsor. "community" is the banner below all the rows. */
  tier: 1 | 2 | 3 | 4 | "community";
  /** Made by `npm run sponsors` from the file with the same name in assets/sponsors. */
  logo?: string;
  url?: string;
  /** Six-digit hex tile colour, for logos designed for a dark background. */
  background?: string;
  /** Nudges a logo that still looks too big or small, e.g. 1.1. Rerun the script after. */
  scale?: number;
};

export type Game = {
  /** Set for every game, so the scorekeeper panel can update one game at a time. */
  id: string;
  /** Any format that includes the date, e.g. "2026-11-28", "Nov 28" or "Sat". */
  day: string;
  time: string;
  /** Team name, or a label such as "1st Place" until a final is decided. */
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  homePim?: number;
  awayPim?: number;
  /** Blank counts as round robin. Anything else stays out of the standings. */
  stage?: string;
  note?: string;
  /**
   * Set from the scorekeeper panel. "live" shows the score as it stands; "final" counts
   * it in the standings. Without it, a game with both scores counts as final.
   */
  status?: "upcoming" | "live" | "final";
};

export const tournament = {
  /** Shows the "sample content" notice. Turn off once real content is in. */
  sampleData: false,
  name: "Raiders Winter Warriors",
  shortName: "Winter Warriors",
  division: "U13-5",
  dateLabel: "November 28–29, 2026",
  // First puck drop. Alberta stopped turning its clocks back in 2026, so it is UTC-6 in November.
  startsAt: "2026-11-28T08:15:00-06:00",
  endsAt: "2026-11-30T00:00:00-06:00",
  days: [
    { date: "2026-11-28", dayOfMonth: "28", weekday: "Saturday", label: "Saturday, November 28" },
    { date: "2026-11-29", dayOfMonth: "29", weekday: "Sunday", label: "Sunday, November 29" },
  ],
  venue: {
    name: "Crowfoot Arena",
    street: "8080 John Laurie Blvd NW",
    city: "Calgary, AB T3G 1X4",
    mapEmbed:
      "https://maps.google.com/maps?q=Crowfoot%20Arena%2C%208080%20John%20Laurie%20Blvd%20NW%2C%20Calgary&z=15&output=embed",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Crowfoot%20Arena%2C%208080%20John%20Laurie%20Blvd%20NW%2C%20Calgary%2C%20AB",
  },
  /** For game times. Alberta is on UTC-6 all year from 2026. */
  utcOffset: "-06:00",
  /** Shown in the footer and on every "coming soon" card once filled in. */
  contactEmail: "",
  scoring: {
    win: 2,
    tie: 1,
    loss: 0,
    /** Extra point to the team with fewer penalty minutes in a game; 0 turns it off. */
    disciplineBonus: 0,
  },
};

export const teams: Team[] = [
  {
    slug: "raiders",
    name: "Raiders U13-5 Black",
    shortName: "Raiders",
    logo: "/logos/raiders.webp",
    logoSurface: "light",
    colours: { main: "#5d3083", trim: "#c9ccd1" },
    roster: [
      { number: "20", name: "Arrick Hamel" },
      { number: "16", name: "Ayaan Parhar" },
      { number: "12", name: "Carter Wowk" },
      { number: "17", name: "Easton King" },
      { number: "11", name: "Felix Komierowski" },
      { number: "15", name: "Gulzar Dhindsa" },
      { number: "8", name: "Jack Bateman" },
      { number: "10", name: "Jacob McRae" },
      { number: "18", name: "James Sanchez" },
      { number: "7", name: "Joven Aujla" },
      { number: "5", name: "Kellan Henriksen" },
      { number: "31", name: "Lennan Smith" },
      { number: "14", name: "Luca Loria" },
      { number: "9", name: "Luke Taylor" },
      { number: "19", name: "Marcus Helvig" },
      { number: "13", name: "Noah Klymchuk" },
      { number: "6", name: "Stanslaus Kachua" },
    ],
    staff: [
      { name: "Kevin Wowk", role: "Head Coach" },
      { name: "Curtis King", role: "Assistant Coach" },
      { name: "David Taylor", role: "Assistant Coach" },
      { name: "Matt Smith", role: "Assistant Coach" },
      { name: "Scott Bateman", role: "Assistant Coach" },
      { name: "Kristi Henriksen", role: "Team Manager" },
    ],
  },
  {
    slug: "pirates",
    name: "Pirates U13-5",
    shortName: "Pirates",
    logo: "/logos/pirates.webp",
    logoSurface: "dark",
    colours: { main: "#076e32", trim: "#efb910" },
    roster: [
      { number: "5", name: "Alexander Bye" },
      { number: "9", name: "Barrett Lacher" },
      { number: "19", name: "Emersyn Brzezicki" },
      { number: "17", name: "Fletcher Dakin" },
      { number: "3", name: "Harjeev Singh Vander" },
      { number: "6", name: "Harrison McGeough" },
      { number: "11", name: "Hayden Witiuk" },
      { number: "14", name: "Jase Lavie" },
      { number: "16", name: "Keegan McGowan" },
      { number: "15", name: "Lane Bulman" },
      { number: "7", name: "Lucas Kolody" },
      { number: "12", name: "Nathan Aiello" },
      { number: "31", name: "Owen Havanka" },
      { number: "2", name: "Ryan Wilson" },
      { number: "18", name: "TJ Vandemark" },
      { number: "10", name: "Yoonjae Chun" },
    ],
    staff: [
      { name: "Mike Bye", role: "Co-Head Coach" },
      { name: "Rob McGowan", role: "Co-Head Coach" },
      { name: "Brad Lacher", role: "Assistant Coach" },
      { name: "Terry Havanka", role: "Assistant Coach" },
      { name: "Travis Dakin", role: "Assistant Coach" },
      { name: "Tyler Vandemark", role: "Assistant Coach" },
      { name: "Dawn Havanka", role: "Team Manager" },
    ],
  },
  {
    slug: "knights",
    name: "Knights U13-5",
    shortName: "Knights",
    logo: "/logos/knights.webp",
    logoSurface: "dark",
    colours: { main: "#900609", trim: "#c9ccd1" },
    roster: [
      { number: "18", name: "Abel Crier" },
      { number: "6", name: "Ali Fayad" },
      { number: "19", name: "Ashton Robert" },
      { number: "15", name: "Avery Verstraete" },
      { number: "7", name: "Brody Morris" },
      { number: "11", name: "Daya Haymour" },
      { number: "10", name: "Elijah Short" },
      { number: "3", name: "Gabriel Ford Conde" },
      { number: "4", name: "Garrett Joly" },
      { number: "14", name: "Henos Negussie" },
      { number: "31", name: "Jaxson Ahearn" },
      { number: "5", name: "Kian Kunyk" },
      { number: "9", name: "Lucus Mayan" },
      { number: "2", name: "Noah Tarrabain" },
      { number: "13", name: "Omar Assaf" },
    ],
    staff: [
      { name: "Colton Verstraete", role: "Head Coach" },
      { name: "Mark Ahearn", role: "Assistant Coach" },
      { name: "Yousef Assaf", role: "Assistant Coach" },
      { name: "Brad Joly", role: "Assistant Coach" },
      { name: "Kurtis Kunyk", role: "Assistant Coach" },
      { name: "Dan Morris", role: "Assistant Coach" },
      { name: "Debbie Carvalho", role: "Team Manager" },
    ],
  },
  {
    slug: "wolverines",
    name: "Wolverines U13-5 Blue",
    shortName: "Wolverines",
    logo: "/logos/wolverines.webp",
    logoSurface: "light",
    colours: { main: "#0d2c5e", trim: "#fcb71b" },
    roster: [
      { number: "17", name: "Barrett Jarvis" },
      { number: "14", name: "Caleb Herritt" },
      { number: "3", name: "Daniel Chon" },
      { number: "15", name: "Danny Robinson" },
      { number: "24", name: "Holden Williams" },
      { number: "31", name: "Jackson Jukes" },
      { number: "13", name: "Jessie Krall" },
      { number: "4", name: "Jude Williams" },
      { number: "10", name: "Kason Murray" },
      { number: "11", name: "Knox Crowshoe" },
      { number: "7", name: "Lily Paris" },
      { number: "16", name: "Lucas Douglas" },
      { number: "6", name: "Marnix Mortier" },
      { number: "2", name: "Nolan Coxford" },
      { number: "9", name: "Otto Schultz" },
      { number: "1", name: "Russel Morse" },
      { number: "12", name: "Tanner Korpesio" },
      { number: "8", name: "Thomas Casella" },
    ],
    staff: [
      { name: "Daniel Morse", role: "Head Coach" },
      { name: "Tyler Jukes", role: "Assistant Coach" },
      { name: "Anne Krall", role: "Assistant Coach" },
      { name: "James Douglas", role: "Assistant Coach" },
      { name: "Ryan Murray", role: "Assistant Coach" },
      { name: "Branden Pavey", role: "Team Manager" },
      { name: "Bryn Cripps", role: "Team Manager" },
    ],
  },
];

/** The starting schedule. Scorekeepers update scores from /admin once the site is live. */
export const games: Game[] = [
  { id: "sat-1", day: "2026-11-28", time: "8:15 – 9:15 AM", home: "Raiders", away: "Knights" },
  { id: "sat-2", day: "2026-11-28", time: "9:30 – 10:30 AM", home: "Pirates", away: "Wolverines" },
  { id: "sat-3", day: "2026-11-28", time: "3:45 – 5:00 PM", home: "Wolverines", away: "Raiders" },
  { id: "sat-4", day: "2026-11-28", time: "5:15 – 6:30 PM", home: "Knights", away: "Pirates" },
  { id: "sun-1", day: "2026-11-29", time: "8:15 – 9:15 AM", home: "Raiders", away: "Pirates" },
  { id: "sun-2", day: "2026-11-29", time: "9:30 – 10:30 AM", home: "Knights", away: "Wolverines" },
  { id: "sun-3", day: "2026-11-29", time: "2:30 – 3:45 PM", home: "TBD", away: "TBD", stage: "B Final" },
  { id: "sun-4", day: "2026-11-29", time: "4:00 – 5:15 PM", home: "TBD", away: "TBD", stage: "A Final" },
];

export const rules: { title: string; items: string[] }[] = [
  {
    title: "Game play format",
    items: [
      "Each team will play three (3) round-robin games, followed by one (1) final placement game based on round-robin standings. All teams are guaranteed four (4) games.",
      "All games are stop time.",
      "No timeouts permitted.",
      "Three-minute warm-up begins at the scheduled permit time.",
      "Players remain on the ice between periods; one-minute intermission between periods.",
    ],
  },
  {
    title: "Tournament points and tie-breaking",
    items: [
      "Teams will receive 2 points for a win, 1 point for a tie and 0 points for a loss.",
      "Round-robin games may end in a tie.",
      "Ties in the standings will be broken first by goal differential, followed by the fewest penalty minutes.",
    ],
  },
  {
    title: "Playoff format",
    items: [
      "The 1st and 2nd place teams will advance to the championship game (A Final).",
      "The 3rd and 4th place teams will play for the consolation game (B Final).",
      "If a playoff game is tied at the end of regulation, the winner will be determined by a shootout.",
    ],
  },
  {
    title: "Game day responsibilities",
    items: [
      "The Raiders will provide the timekeeper, scorekeeper and penalty box volunteers for all games.",
      "Teams are responsible for ensuring their dressing rooms are left clean within 30 minutes of the final whistle.",
    ],
  },
];

/** One player on every team receives each of these. */
export const awards: Award[] = [
  {
    series: "Winter Warrior",
    name: "MVP",
    logo: "/awards/mvp.webp",
    glow: "ice",
    description:
      "Awarded to the player who leads the charge and makes the greatest overall impact on their team’s battle for victory. Combining sharp skill, hockey sense, and clutch execution, this warrior dominates the ice and changes the outcome of the game when it matters most.",
  },
  {
    series: "Winter Warrior",
    name: "Heart & Hustle",
    logo: "/awards/heart-and-hustle.webp",
    glow: "violet",
    description:
      "Awarded to the relentless competitor who leaves everything on the ice, regardless of the scoresheet. Fueled by pure grit and determination, this warrior never backs down from a battle along the boards, outworks the opposition every shift, and rallies their team from puck drop to the final buzzer.",
  },
];

export const raffle: {
  fiftyFiftyUrl: string;
  drawNotice: string;
  feature: FeatureDraw | null;
  cash: Prize[];
  draws: Prize[];
} = {
  /** Link to the online 50/50 raffle. */
  fiftyFiftyUrl: "",
  /** Shown at the top of the raffle page. */
  drawNotice:
    "All winners will be drawn on Sunday, November 29, following the conclusion of the second game of the day, in accordance with AGLC guidelines.",
  feature: {
    value: "$1,000",
    name: "Tire Gift Certificate",
    donor: "Shaganappi GM",
    description: "Hit the winter roads with confidence, thanks to a $1,000 tire gift certificate from Shaganappi GM.",
  },
  cash: [
    {
      name: "Mystery Jersey",
      icon: "jersey",
      description:
        "A 50/50 draw with an exciting twist, featuring a bonus prize for the lucky player.",
    },
    {
      name: "50/50",
      icon: "coins",
      fiftyFifty: true,
      description:
        "The classic hockey tradition. Get your tickets for a chance to take home a cash prize.",
    },
  ],
  draws: [
    {
      name: "Rink Ready",
      icon: "sticks",
      description:
        "Get rink ready with a quality hockey stick, a heated stadium seat and $180 in Conroy Hockey gift cards.",
    },
    {
      name: "Chef's Pack",
      icon: "chef",
      description:
        "Take your cooking up a notch and upgrade your kitchen with chef-grade equipment.",
    },
    {
      name: "Happy Hour",
      icon: "drink",
      description:
        "Be ready to host your next get-together with a cooler full of liquor.",
    },
    {
      name: "Family Fun Day",
      icon: "family",
      description:
        "Make lasting memories together with a variety of fun passes for the whole family to enjoy.",
    },
    {
      name: "Hockey Lovers",
      icon: "trophy",
      description:
        "For the young and the young at heart: a mini-stick hockey set and three box sets of hockey cards.",
    },
    {
      name: "Pamper Mom",
      icon: "flower",
      description:
        "Treat Mom to some well-deserved relaxation with two $100 massage gift cards and a selection of other pampering treats.",
    },
    {
      name: "Dine In or Out",
      icon: "dining",
      description:
        "Make homemade pizza on your new pizza stone, or take the night off and head out to Brewsters for dinner.",
    },
    {
      name: "Junior Golfer",
      icon: "golf",
      description:
        "Get your young golfer ready for the course with a starter kit featuring a golf bag and other golf gear.",
    },
    {
      name: "Sweets and Gear",
      icon: "candy",
      description:
        "Satisfy your sweet tooth with an extra-large treat basket, then gear up with a $100 gift card to Hockey Life.",
    },
    {
      name: "Sweet Hat Trick",
      icon: "clover",
      description:
        "Indulge in a chocolate gift basket, then try your luck with a variety of lottery scratch cards.",
    },
  ],
};

/** Shown in this order within each tier. */
export const sponsors: Sponsor[] = [
  { name: "Shaganappi GM", tier: 1, logo: "/sponsors/shaganappi-gm.webp" },
  { name: "CAYK Marketing & Analytics", tier: 2, logo: "/sponsors/cayk.webp", scale: 0.92 },
  { name: "BFL Canada", tier: 2, logo: "/sponsors/bfl-canada.webp", scale: 1.07 },
  { name: "Trail", tier: 2, logo: "/sponsors/trail.webp", scale: 1.14 },
  { name: "WinSport", tier: 3, logo: "/sponsors/winsport.webp" },
  { name: "Mountain View Optometry", tier: 3, logo: "/sponsors/mountain-view-optometry.webp" },
  { name: "A&B Plumbing & Heating Ltd.", tier: 3, logo: "/sponsors/ab-plumbing.webp", scale: 1.14 },
  { name: "Gil Property Management and Sales Ltd.", tier: 3, logo: "/sponsors/gil-property.webp" },
  { name: "Massage Addict", tier: 3, logo: "/sponsors/massage-addict.webp", scale: 0.92 },
  { name: "Bow River Electric Ltd.", tier: 3, logo: "/sponsors/bow-river-electric.webp" },
  { name: "Safeway", tier: 4, logo: "/sponsors/safeway.webp" },
  { name: "Flying Squirrel", tier: 4, logo: "/sponsors/flying-squirrel.webp", scale: 1.14 },
  { name: "DQ Grill & Chill", tier: 4, logo: "/sponsors/dairy-queen.webp", scale: 1.1 },
  { name: "Cineplex Cinemas", tier: 4, logo: "/sponsors/cineplex.webp", scale: 0.92 },
  { name: "Brewsters Brewing Company & Restaurant", tier: 4, logo: "/sponsors/brewsters.webp" },
  { name: "Big Chief", tier: 4, logo: "/sponsors/big-chief.webp", scale: 1.08 },
  { name: "Tuxedo Source for Sports", tier: 4, logo: "/sponsors/tuxedo-source-for-sports.webp", scale: 0.96 },
  { name: "Over the Top Pop Shop & Treats", tier: 4, logo: "/sponsors/over-the-top.webp", scale: 1.06 },
  { name: "Friends and families of the Raiders U13-5 Black", tier: "community", logo: "/sponsors/raiders-families.webp" },
];

export const navigation = [
  { href: "/schedule", label: "Schedule" },
  { href: "/teams", label: "Teams" },
  { href: "/rules", label: "Rules" },
  { href: "/awards", label: "Awards" },
  { href: "/raffle", label: "Raffle" },
  { href: "/sponsors", label: "Sponsors" },
];
