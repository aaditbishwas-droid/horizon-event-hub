import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EVENT_DAYS, type DayId } from "@/lib/event";
import { DEPARTMENTS, SPEAKERS, filterSpeakers, initials, paginate, type Department } from "@/lib/speakers";

export const Route = createFileRoute("/speakers")({
  head: () => ({
    meta: [
      { title: "Speakers · Horizon Retreat 2026" },
      { name: "description", content: "Browse all 80 Horizon Retreat speakers. Filter by department or event day and search by name." },
      { property: "og:title", content: "Speakers · Horizon Retreat 2026" },
      { property: "og:description", content: "80 speakers across engineering, design, finance, healthcare and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpeakersPage,
});

const dayLabel = (id: DayId) => EVENT_DAYS.find((d) => d.id === id)!.label;

function SpeakersPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<Department | "all">("all");
  const [day, setDay] = useState<DayId | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => filterSpeakers(SPEAKERS, { query, department, day }), [query, department, day]);
  const { items, pageCount, page: current } = paginate(filtered, page);
  const hasFilters = query !== "" || department !== "all" || day !== "all";

  const reset = () => { setQuery(""); setDepartment("all"); setDay("all"); setPage(1); };

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Line-up</span>
        <h1 className="mt-1 text-2xl font-semibold">Speakers</h1>
        <p className="mt-1 text-sm text-muted-foreground">{SPEAKERS.length} voices across four days.</p>
      </div>

      <div className="surface flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search speakers by name"
            aria-label="Search speakers by name"
            className="border-0 bg-muted/60 pl-9 shadow-none"
            maxLength={60}
          />
        </div>
        <Select value={department} onValueChange={(v) => { setDepartment(v as Department | "all"); setPage(1); }}>
          <SelectTrigger className="md:w-48" aria-label="Filter by department"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={day} onValueChange={(v) => { setDay(v as DayId | "all"); setPage(1); }}>
          <SelectTrigger className="md:w-44" aria-label="Filter by event date"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All dates</SelectItem>
            {EVENT_DAYS.map((d) => <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}><X /> Clear</Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {filtered.length === 0
          ? "No speakers match your filters."
          : `Showing ${(current - 1) * 20 + 1}–${(current - 1) * 20 + items.length} of ${filtered.length}`}
      </div>

      {items.length > 0 && (
        <ul className="surface divide-y overflow-hidden">
          {items.map((s) => (
            <li key={s.id} className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors hover:bg-muted/40 md:grid-cols-[auto_1.2fr_1.4fr_auto_auto]">
              <span className="row-span-2 grid size-10 place-items-center rounded-full bg-accent text-sm font-semibold text-primary md:row-span-1">
                {initials(s.name)}
              </span>
              <div className="min-w-0">
                <div className="truncate font-medium">{s.name}</div>
                <div className="truncate text-xs text-muted-foreground">{s.role}, {s.company}</div>
              </div>
              <div className="col-start-2 truncate text-sm text-muted-foreground md:col-start-auto">“{s.talk}”</div>
              <span className="hidden rounded-full bg-secondary px-2.5 py-1 text-xs font-medium md:inline">{s.department}</span>
              <span className="hidden text-right text-xs text-muted-foreground md:block">
                {dayLabel(s.day)}<br />{s.time}
              </span>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
            <ChevronLeft /> Prev
          </Button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Button key={n} size="icon" variant={n === current ? "default" : "ghost"} className="size-8"
              aria-current={n === current ? "page" : undefined} onClick={() => setPage(n)}>
              {n}
            </Button>
          ))}
          <Button variant="ghost" size="sm" disabled={current === pageCount} onClick={() => setPage(current + 1)}>
            Next <ChevronRight />
          </Button>
        </nav>
      )}
    </div>
  );
}
