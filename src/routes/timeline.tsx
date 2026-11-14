import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Mic2, PartyPopper, Utensils } from "lucide-react";

import { EVENT_DAYS, type DayId } from "@/lib/event";
import { SPEAKERS } from "@/lib/speakers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Event Timeline · Horizon Retreat 2026" },
      { name: "description", content: "Day-by-day schedule for Horizon Retreat, December 2–5, 2026 in Paris." },
      { property: "og:title", content: "Event Timeline · Horizon Retreat 2026" },
      { property: "og:description", content: "Talks, workshops and networking from Dec 2 to Dec 5, 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimelinePage,
});

type Slot = { time: string; title: string; detail: string; kind: "talk" | "break" | "meal" | "social" };

const FIXED: Slot[] = [
  { time: "08:30", title: "Doors open & coffee", detail: "Badge pick-up at the main hall", kind: "break" },
  { time: "12:30", title: "Lunch", detail: "Garden terrace", kind: "meal" },
  { time: "18:00", title: "Evening networking", detail: "Rooftop lounge", kind: "social" },
];

function slotsFor(day: DayId): Slot[] {
  const talks: Slot[] = SPEAKERS.filter((s) => s.day === day).map((s) => ({
    time: s.time,
    title: s.talk,
    detail: `${s.name} · ${s.department}`,
    kind: "talk",
  }));
  return [...FIXED, ...talks].sort((a, b) => a.time.localeCompare(b.time));
}

const ICONS = { talk: Mic2, break: Coffee, meal: Utensils, social: PartyPopper };

function TimelinePage() {
  const [day, setDay] = useState<DayId>(EVENT_DAYS[0].id);
  const slots = slotsFor(day);

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Schedule</span>
        <h1 className="mt-1 text-2xl font-semibold">Event Timeline</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {EVENT_DAYS.map((d, i) => (
          <button key={d.id} role="tab" aria-selected={d.id === day} onClick={() => setDay(d.id)}
            className={cn(
              "shrink-0 cursor-pointer rounded-xl border px-4 py-2.5 text-left transition-all",
              d.id === day ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-ring/50",
            )}>
            <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Day {i + 1}</div>
            <div className="text-sm font-semibold">{d.label}</div>
          </button>
        ))}
      </div>

      <ol className="surface relative space-y-0 p-2">
        {slots.map((s, i) => {
          const Icon = ICONS[s.kind];
          return (
            <li key={`${s.time}-${i}`} className="grid grid-cols-[3.5rem_auto_1fr] items-start gap-4 rounded-lg px-3 py-3 hover:bg-muted/40">
              <span className="pt-1.5 font-display text-sm font-semibold tabular-nums">{s.time}</span>
              <span className={cn("grid size-8 place-items-center rounded-full",
                s.kind === "talk" ? "bg-accent text-primary" : "bg-brand-soft text-brand")}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 pt-0.5">
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.detail}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
