export const EVENT = {
  name: "Horizon Retreat",
  tagline: "Connecting professionals from various industries",
  dates: "Dec 2 – 5, 2026",
  city: "Paris",
  capacity: 1500,
  appliedBase: 1248,
  speakerCount: 80,
};

export const EVENT_DAYS = [
  { id: "2026-12-02", label: "Wed, Dec 2", short: "Dec 2" },
  { id: "2026-12-03", label: "Thu, Dec 3", short: "Dec 3" },
  { id: "2026-12-04", label: "Fri, Dec 4", short: "Dec 4" },
  { id: "2026-12-05", label: "Sat, Dec 5", short: "Dec 5" },
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

export const TIERS: Tier[] = [
  {
    id: "student",
    name: "Student",
    price: 59,
    blurb: "Full access for enrolled students.",
    perks: ["All talks & workshops", "Lunch on all days", "Student networking lounge"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 109,
    blurb: "The complete retreat experience.",
    perks: ["Everything in Student", "Session recordings", "Evening networking dinner"],
  },
  {
    id: "vip",
    name: "VIP",
    price: 499,
    blurb: "Front row, backstage and beyond.",
    perks: ["Everything in Professional", "Speaker meet & greet", "Reserved front-row seating"],
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
