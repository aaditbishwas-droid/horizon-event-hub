export const EVENT = {
  name: "Horizon Retreat",
  tagline: "Connecting professionals from various industries",
  dates: "Dec 2 – 4, 2026",
  city: "Paris",
  capacity: 1500,
  appliedBase: 1248,
  speakerCount: 80,
};

export const EVENT_DAYS = [
  { id: "2026-12-02", label: "Wed, Dec 2", short: "Dec 2" },
  { id: "2026-12-03", label: "Thu, Dec 3", short: "Dec 3" },
  { id: "2026-12-04", label: "Fri, Dec 4", short: "Dec 4" },
] as const;

export type DayId = (typeof EVENT_DAYS)[number]["id"];

export const CONTACT = {
  email: "horizonsupport@gmail.com",
  phones: ["+01 23 23 23 23", "+33 1 92 39 39 39"],
  address: "Horizon Convention Centre, 12 Rue de la Paix, 75002 Paris, France",
  hours: "Mon – Fri, 9:00 – 18:00 CET",
};

export type TierId = "student" | "professional" | "vip";

export type Tier = {
  id: TierId;
  name: string;
  price: number;
  blurb: string;
  perks: string[];
  limited?: boolean;
  seatsLeft?: number;
};

/** Shown first on every tier above Student. */
export const PREVIOUS_PERKS = "Previous perks included!";

export const TIERS: Tier[] = [
  {
    id: "student",
    name: "Student",
    price: 59,
    blurb: "Full access for enrolled students.",
    perks: [
      "Access to all keynotes & talks",
      "Open workshop entry",
      "Daily lunch & coffee",
      "Student networking lounge",
      "Digital event pass",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 109,
    blurb: "The complete retreat experience.",
    perks: [
      PREVIOUS_PERKS,
      "Reserved workshop seats",
      "Full session recordings",
      "Evening networking mixer",
      "Welcome kit & certificate",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    price: 499,
    blurb: "Front row, backstage and beyond.",
    perks: [
      PREVIOUS_PERKS,
      "Private on-site dinner with speakers",
      "Reserved front-row seating",
      "Backstage speaker meet & greet",
      "VIP lounge with concierge",
      "Priority check-in",
    ],
    limited: true,
    seatsLeft: 12,
  },
];

export function getTier(id: TierId): Tier {
  return TIERS.find((t) => t.id === id)!;
}

/** Tiers a holder can move up to, cheapest first. */
export function upgradeOptions(current: TierId): Tier[] {
  const from = getTier(current);
  return TIERS.filter((t) => t.price > from.price).sort((a, b) => a.price - b.price);
}

export function upgradeCost(from: TierId, to: TierId): number {
  return Math.max(0, getTier(to).price - getTier(from).price);
}

/** Weekly cumulative applications leading up to today. */
export const APPLICATION_GROWTH = [
  { week: "Aug 15", applied: 64 },
  { week: "Aug 22", applied: 131 },
  { week: "Aug 29", applied: 188 },
  { week: "Sep 5", applied: 262 },
  { week: "Sep 12", applied: 340 },
  { week: "Sep 19", applied: 418 },
  { week: "Sep 26", applied: 503 },
  { week: "Oct 3", applied: 596 },
  { week: "Oct 10", applied: 684 },
  { week: "Oct 17", applied: 779 },
  { week: "Oct 24", applied: 871 },
  { week: "Oct 31", applied: 968 },
  { week: "Nov 7", applied: 1092 },
  { week: "Nov 14", applied: 1248 },
];
