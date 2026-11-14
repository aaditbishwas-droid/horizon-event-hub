import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Armchair, Mic2, Users } from "lucide-react";

import heroImage from "@/assets/hero-horizon.jpg";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/lib/app-state";
import { EVENT, TIERS } from "@/lib/event";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · Horizon Retreat 2026" },
      { name: "description", content: "Connecting professionals from various industries. Dec 2–5, 2026 in Paris — grab your seat." },
      { property: "og:title", content: "Horizon Retreat 2026 — Grab your seat" },
      { property: "og:description", content: "Connecting professionals from various industries. Dec 2–5, 2026 in Paris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { profile, openApply } = useAppState();
  const applied = EVENT.appliedBase + (profile.ticket ? 1 : 0);
  const remaining = EVENT.capacity - applied;
  const filled = Math.round((applied / EVENT.capacity) * 100);

  const kpis = [
    { label: "People applied", value: applied.toLocaleString("en-US"), note: `${filled}% of capacity`, icon: Users },
    { label: "Seats remaining", value: remaining.toLocaleString("en-US"), note: `of ${EVENT.capacity.toLocaleString("en-US")} total`, icon: Armchair, progress: filled },
    { label: "Speakers", value: String(EVENT.speakerCount), note: "across 8 departments", icon: Mic2 },
  ];

  return (
    <div className="space-y-8">
      <section className="surface grid overflow-hidden md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center gap-5 p-7 md:p-10">
          <span className="eyebrow">{EVENT.dates} · {EVENT.city}</span>
          <h1 className="text-3xl font-semibold leading-[1.1] md:text-[2.6rem]">
            Connecting professionals from various industries.
          </h1>
          <p className="max-w-md text-muted-foreground">
            Four days of talks, workshops and honest conversations with people who build, design, fund and lead.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {profile.ticket ? (
              <Button variant="outline" size="xl" disabled>
                You're registered
              </Button>
            ) : (
              <Button variant="cta" size="xl" onClick={() => openApply()}>
                Grab your seat now! <ArrowRight />
              </Button>
            )}
            <Button variant="ghost" size="xl" asChild>
              <Link to="/speakers">Meet the speakers</Link>
            </Button>
          </div>
        </div>
        <div className="relative min-h-64 md:min-h-full">
          <img
            src={heroImage}
            alt="Professionals connected across a glowing network beneath a rising sun"
            width={1280}
            height={960}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{k.label}</span>
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-primary">
                <k.icon className="size-4" />
              </span>
            </div>
            <div className="mt-3 font-display text-3xl font-semibold">{k.value}</div>
            {k.progress !== undefined && <Progress value={k.progress} className="mt-3 h-1.5" />}
            <div className="mt-2 text-xs text-muted-foreground">{k.note}</div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="eyebrow">Tickets</span>
            <h2 className="mt-1 text-xl font-semibold">Pick the seat that fits</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => {
            const featured = t.id === "professional";
            const owned = profile.ticket === t.id;
            return (
              <div key={t.id} className={cn("surface flex flex-col p-6", featured && "ring-1 ring-primary")}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t.name}</span>
                  {t.limited && (
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                      {t.seatsLeft} left
                    </span>
                  )}
                  {featured && !t.limited && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-3 font-display text-3xl font-semibold">${t.price}</div>
                <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                <ul className="mt-4 flex-1 space-y-1.5 text-sm">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" /> {p}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-5"
                  variant={featured ? "default" : "outline"}
                  disabled={!!profile.ticket}
                  onClick={() => openApply(t.id)}
                >
                  {owned ? "Your ticket" : `Choose ${t.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
