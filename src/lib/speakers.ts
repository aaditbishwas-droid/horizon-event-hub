import { EVENT_DAYS, type DayId } from "./event";

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Finance",
  "Healthcare",
  "Sustainability",
  "Leadership",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export type Speaker = {
  id: number;
  name: string;
  role: string;
  company: string;
  department: Department;
  day: DayId;
  time: string;
  talk: string;
};

const FIRST = [
  "Amara", "Lucas", "Priya", "Mateo", "Sofia", "Kenji", "Leila", "Noah", "Ines", "Rohan",
  "Clara", "Elias", "Zara", "Hugo", "Mei", "Omar", "Freya", "Diego", "Anika", "Theo",
  "Nadia", "Jonas", "Aisha", "Felix", "Yara", "Arjun", "Elena", "Samuel", "Lina", "Victor",
  "Chloe", "Rafael", "Hana", "Adrian", "Maya", "Kofi", "Isla", "Tomas", "Sana", "Julien",
];
const LAST = [
  "Okafor", "Bernard", "Sharma", "García", "Rossi", "Tanaka", "Haddad", "Fischer", "Moreau", "Iyer",
  "Larsen", "Novak", "Khan", "Dubois", "Chen", "Farouk", "Nilsson", "Ortega", "Mehta", "Laurent",
  "Petrova", "Weber", "Bello", "Schmidt", "Costa", "Kapoor", "Popescu", "Adeyemi", "Berg", "Silva",
  "Martin", "Alves", "Sato", "Kowalski", "Rahman", "Mensah", "Walsh", "Ruiz", "Ali", "Lefèvre",
];
const COMPANIES = [
  "Northwind Labs", "Atlas Health", "Lumen Studio", "Verdant Energy", "Brightpath Capital",
  "Orbit Systems", "Kite & Co.", "Meridian Group", "Polar Analytics", "Fable Design",
];
const ROLES: Record<Department, string[]> = {
  Engineering: ["Principal Engineer", "CTO", "Staff Engineer"],
  Design: ["Design Director", "Head of UX", "Product Designer"],
  Product: ["VP Product", "Product Lead", "Group PM"],
  Marketing: ["CMO", "Brand Lead", "Growth Director"],
  Finance: ["CFO", "Investment Partner", "Finance Lead"],
  Healthcare: ["Chief Medical Officer", "Clinical Lead", "Health Researcher"],
  Sustainability: ["Head of Climate", "ESG Director", "Sustainability Lead"],
  Leadership: ["CEO", "Founder", "Chief People Officer"],
};
const TALKS: Record<Department, string[]> = {
  Engineering: ["Scaling teams without slowing down", "Shipping AI responsibly", "The quiet art of reliability"],
  Design: ["Designing for trust", "Systems that scale with taste", "Less, but better interfaces"],
  Product: ["From insight to roadmap", "Saying no with data", "Building for the next billion"],
  Marketing: ["Brands people talk about", "Community-led growth", "Storytelling that converts"],
  Finance: ["Funding in a cautious market", "Metrics that actually matter", "Capital for the long game"],
  Healthcare: ["Digital care that works", "Data, privacy and patients", "The future of clinics"],
  Sustainability: ["Net zero, for real", "Circular by design", "Climate as a business case"],
  Leadership: ["Leading through ambiguity", "Culture is a product", "Hiring for curiosity"],
};
const TIMES = ["09:30", "10:30", "11:30", "13:30", "14:30", "15:30", "16:30"];

export const SPEAKERS: Speaker[] = Array.from({ length: 80 }, (_, i) => {
  const department = DEPARTMENTS[i % DEPARTMENTS.length];
  const variant = Math.floor(i / DEPARTMENTS.length) % 3;
  return {
    id: i + 1,
    name: `${FIRST[i % FIRST.length]} ${LAST[(i * 7 + 3) % LAST.length]}`,
    role: ROLES[department][variant],
    company: COMPANIES[(i * 3) % COMPANIES.length],
    department,
    day: EVENT_DAYS[(i * 3 + Math.floor(i / 8)) % EVENT_DAYS.length].id,
    time: TIMES[(i * 5) % TIMES.length],
    talk: TALKS[department][variant],
  };
});

export const PAGE_SIZE = 20;

export type SpeakerFilters = {
  query: string;
  department: Department | "all";
  day: DayId | "all";
};

export function filterSpeakers(list: Speaker[], f: SpeakerFilters): Speaker[] {
  const q = f.query.trim().toLowerCase();
  return list.filter(
    (s) =>
      (f.department === "all" || s.department === f.department) &&
      (f.day === "all" || s.day === f.day) &&
      (q === "" || s.name.toLowerCase().includes(q)),
  );
}

export function paginate<T>(list: T[], page: number, size = PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(Math.max(1, page), pageCount);
  return { items: list.slice((current - 1) * size, current * size), pageCount, page: current };
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
