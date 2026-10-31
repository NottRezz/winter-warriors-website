/**
 * All the tournament's content lives here. Fill in a list or a blank value and
 * the matching page switches from its "coming soon" card to the real content.
 */

export type Team = {
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  /** Background the logo was designed on. */
  logoSurface: "light" | "dark";
  roster: { number: string; name: string; position?: string }[];
  staff: { name: string; role: string }[];
};

export type Game = {
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
};

export const tournament = {
  /** Shows the "sample content" notice. Turn off once real content is in. */
  sampleData: true,
  name: "Raiders Winter Warriors",
  shortName: "Winter Warriors",
  division: "U13",
  dateLabel: "November 28–29, 2026",
  startsAt: "2026-11-28T00:00:00-07:00",
  endsAt: "2026-11-30T00:00:00-07:00",
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
  /** Shown in the footer and on every "coming soon" card once filled in. */
  contactEmail: "contact@example.com",
  /**
   * Link to the schedule Google Sheet (File > Share > Publish to web > CSV).
   * While set, the site reads games from the sheet and refreshes every minute,
   * so scores can be updated from a phone. See README.md.
   */
  scheduleCsvUrl: "",
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
    name: "Raiders U13 5 Black",
    shortName: "Raiders",
    logo: "/logos/raiders.webp",
    logoSurface: "light",
    roster: [
      { number: "1", name: "Maya Lindqvist", position: "G" },
      { number: "3", name: "Noah Fedoruk", position: "D" },
      { number: "5", name: "Ava Sandhu", position: "D" },
      { number: "7", name: "Liam Hargreaves", position: "F" },
      { number: "8", name: "Ethan Wojcik", position: "D" },
      { number: "9", name: "Zoe Tremblay", position: "F" },
      { number: "11", name: "Mason Okafor", position: "F" },
      { number: "12", name: "Lucas Moreau", position: "D" },
      { number: "14", name: "Ben Nakamura", position: "F" },
      { number: "16", name: "Emma Kowalchuk", position: "F" },
      { number: "19", name: "Jack Dunmore", position: "F" },
      { number: "22", name: "Aiden Rasmussen", position: "F" },
      { number: "30", name: "Owen Brandt", position: "G" },
    ],
    staff: [
      { name: "Dana Hargreaves", role: "Head Coach" },
      { name: "Marcus Brandt", role: "Assistant Coach" },
      { name: "Priya Sandhu", role: "Team Manager" },
    ],
  },
  {
    slug: "pirates",
    name: "Pirates U13 5",
    shortName: "Pirates",
    logo: "/logos/pirates.webp",
    logoSurface: "dark",
    roster: [
      { number: "2", name: "Isaac Thiessen", position: "D" },
      { number: "4", name: "Nora Belanger", position: "D" },
      { number: "6", name: "Caleb Yuen", position: "D" },
      { number: "10", name: "Riley Chartrand", position: "F" },
      { number: "13", name: "Sophie Vandenberg", position: "F" },
      { number: "15", name: "Tyler Mbeki", position: "F" },
      { number: "17", name: "Grace Halloran", position: "D" },
      { number: "18", name: "Dylan Petrov", position: "F" },
      { number: "20", name: "Hailey Dhaliwal", position: "F" },
      { number: "21", name: "Nathan Oskam", position: "F" },
      { number: "24", name: "Carter Lindholt", position: "F" },
      { number: "31", name: "Hannah Prokop", position: "G" },
      { number: "35", name: "Cole Whitford", position: "G" },
    ],
    staff: [
      { name: "Glen Thiessen", role: "Head Coach" },
      { name: "Renee Chartrand", role: "Assistant Coach" },
      { name: "Monica Yuen", role: "Team Manager" },
    ],
  },
  {
    slug: "knights",
    name: "Knights U13 5",
    shortName: "Knights",
    logo: "/logos/knights.webp",
    logoSurface: "dark",
    roster: [
      { number: "1", name: "Ella Stratton", position: "G" },
      { number: "2", name: "Logan Ferreira", position: "D" },
      { number: "4", name: "Jonah Abernathy", position: "D" },
      { number: "6", name: "Chloe Marchetti", position: "D" },
      { number: "8", name: "Wyatt Solberg", position: "F" },
      { number: "9", name: "Amira Haddad", position: "F" },
      { number: "10", name: "Parker Dyck", position: "F" },
      { number: "12", name: "Eli Greenwood", position: "D" },
      { number: "15", name: "Lily Novak", position: "F" },
      { number: "17", name: "Hunter Baptiste", position: "F" },
      { number: "21", name: "Theo Macleish", position: "F" },
      { number: "23", name: "Jasper Ingram", position: "F" },
      { number: "33", name: "Sam Kaczmarek", position: "G" },
    ],
    staff: [
      { name: "Tessa Stratton", role: "Head Coach" },
      { name: "Paul Ferreira", role: "Assistant Coach" },
      { name: "Leah Greenwood", role: "Team Manager" },
    ],
  },
  {
    slug: "wolverines",
    name: "Wolverines U13 5 Blue",
    shortName: "Wolverines",
    logo: "/logos/wolverines.webp",
    logoSurface: "light",
    roster: [
      { number: "3", name: "Finn Aldridge", position: "D" },
      { number: "5", name: "Mia Rosenthal", position: "D" },
      { number: "7", name: "Gavin Pruden", position: "F" },
      { number: "9", name: "Kayla Oyelaran", position: "F" },
      { number: "11", name: "Declan Fitzroy", position: "F" },
      { number: "13", name: "Harper Zielinski", position: "D" },
      { number: "14", name: "Colton Reimer", position: "F" },
      { number: "16", name: "Anika Bhatt", position: "F" },
      { number: "18", name: "Micah Tolland", position: "D" },
      { number: "19", name: "Rowan Eastman", position: "F" },
      { number: "27", name: "Julian Sorensen", position: "F" },
      { number: "29", name: "Tessa Lachance", position: "G" },
      { number: "37", name: "Blake Whitehorn", position: "G" },
    ],
    staff: [
      { name: "Rob Aldridge", role: "Head Coach" },
      { name: "Sandra Reimer", role: "Assistant Coach" },
      { name: "Joanne Pruden", role: "Team Manager" },
    ],
  },
];

/** Used when scheduleCsvUrl is blank. */
export const games: Game[] = [
  { day: "2026-11-28", time: "8:00 AM", home: "Raiders", away: "Pirates", homeScore: 3, awayScore: 1, homePim: 4, awayPim: 8 },
  { day: "2026-11-28", time: "9:30 AM", home: "Knights", away: "Wolverines", homeScore: 2, awayScore: 2, homePim: 6, awayPim: 6 },
  { day: "2026-11-28", time: "1:15 PM", home: "Pirates", away: "Knights", homeScore: 4, awayScore: 2, homePim: 4, awayPim: 10 },
  { day: "2026-11-28", time: "2:45 PM", home: "Wolverines", away: "Raiders", homeScore: 1, awayScore: 3, homePim: 8, awayPim: 2 },
  { day: "2026-11-29", time: "8:00 AM", home: "Raiders", away: "Knights", homeScore: 2, awayScore: 2, homePim: 4, awayPim: 4 },
  { day: "2026-11-29", time: "9:30 AM", home: "Pirates", away: "Wolverines", homeScore: 3, awayScore: 2, homePim: 6, awayPim: 4 },
  { day: "2026-11-29", time: "12:30 PM", home: "3rd Place", away: "4th Place", stage: "Bronze game" },
  { day: "2026-11-29", time: "2:00 PM", home: "1st Place", away: "2nd Place", stage: "Championship" },
];

export const rules: { title: string; items: string[] }[] = [
  {
    title: "Game format",
    items: [
      "Each team plays three round robin games, followed by a final placement game.",
      "Games are three 13-minute stop time periods, with a 3-minute warm-up.",
      "No timeouts, and players stay on the ice between periods.",
      "This is a non-contact tournament.",
    ],
  },
  {
    title: "Points and standings",
    items: [
      "2 points for a win, 1 point for a tie and 0 points for a loss.",
      "Round robin games may end in a tie.",
      "Ties in the standings are broken by goal difference, then fewest penalty minutes.",
    ],
  },
  {
    title: "Final games",
    items: [
      "1st and 2nd place play for the championship.",
      "3rd and 4th place play the bronze game.",
      "A tied final goes to a shootout.",
    ],
  },
  {
    title: "Eligibility and conduct",
    items: [
      "Only players listed on the official team roster may play.",
      "Line-ups must be ready 20 minutes before each game.",
      "All players must wear full equipment, including a neck guard.",
      "Referee decisions are final.",
      "Unsportsmanlike behaviour may result in removal from the tournament.",
    ],
  },
  {
    title: "Team volunteers and dressing rooms",
    items: [
      "The home team provides the timekeeper and the away team provides the scorekeeper.",
      "Each team provides one volunteer for its penalty box.",
      "Dressing rooms must be left clean within 30 minutes of the final whistle.",
    ],
  },
];

export const awards: { name: string; description: string }[] = [
  {
    name: "Winter Warrior MVP",
    description: "Given to the player who leads by example and rises to the occasion every game.",
  },
  {
    name: "Iron Will Award",
    description: "For relentless effort and the work ethic that sets the tone for the whole bench.",
  },
  {
    name: "Crew Spirit Award",
    description: "For the teammate who keeps the room positive and lifts everyone around them.",
  },
  {
    name: "Most Improved Player",
    description: "For the player who takes the biggest step forward over the weekend.",
  },
];

export const raffle = {
  /** Link to the online 50/50 raffle. */
  fiftyFiftyUrl: "https://example.com",
  items: [
    { name: "Family skate pass", description: "Four passes to public skating.", donor: "Sample Sports Co." },
    { name: "Autographed hockey stick", description: "Signed stick, ready to display.", donor: "Sample Auto Group" },
    { name: "Pizza party for the team", description: "Enough for the whole dressing room.", donor: "Sample Pizza Co." },
    { name: "Hockey gift basket", description: "Tape, socks, a water bottle and more.", donor: "Sample Hardware" },
    { name: "Coffee lover's bundle", description: "Beans, mugs and a gift card.", donor: "Sample Coffee Roasters" },
  ],
};

export const sponsors: { name: string; logo?: string; url?: string }[] = [
  { name: "Sample Sports Co." },
  { name: "Sample Auto Group" },
  { name: "Sample Pizza Co." },
  { name: "Sample Hardware" },
  { name: "Sample Coffee Roasters" },
  { name: "Sample Family Dental" },
  { name: "Sample Realty" },
  { name: "Sample Insurance" },
];

export const navigation = [
  { href: "/schedule", label: "Schedule" },
  { href: "/teams", label: "Teams" },
  { href: "/rules", label: "Rules" },
  { href: "/awards", label: "Awards" },
  { href: "/raffle", label: "Raffle" },
  { href: "/sponsors", label: "Sponsors" },
];
