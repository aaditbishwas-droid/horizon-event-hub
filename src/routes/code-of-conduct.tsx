import { createFileRoute } from "@tanstack/react-router";
import { CONTACT, EVENT } from "@/lib/event";

export const Route = createFileRoute("/code-of-conduct")({
  head: () => ({
    meta: [
      { title: "Code of Conduct · Horizon Retreat 2026" },
      { name: "description", content: "The rules every attendee, speaker and partner agrees to at Horizon Retreat." },
      { property: "og:title", content: "Code of Conduct · Horizon Retreat 2026" },
      { property: "og:description", content: "How we keep Horizon Retreat safe, respectful and welcoming." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CodeOfConduct,
});

const RULES = [
  { title: "Be respectful", body: "Treat every attendee, speaker, volunteer and staff member with courtesy. Disagree with ideas, never with people." },
  { title: "No harassment", body: "Harassment of any kind — including offensive comments, intimidation, stalking, or unwelcome attention — is not tolerated." },
  { title: "Be inclusive", body: "Welcome people of all backgrounds, identities, abilities and levels of experience. Make room for others to speak." },
  { title: "Respect privacy", body: "Ask before photographing or recording people. Honour the no-photo lanyards and off-the-record sessions." },
  { title: "Act professionally", body: "Keep sponsor pitches to designated areas, follow venue rules, and drink responsibly at social events." },
  { title: "Keep it safe", body: "Follow staff instructions and safety signage. Report anything that makes you or others feel unsafe." },
];

function CodeOfConduct() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header>
        <span className="eyebrow">{EVENT.name}</span>
        <h1 className="mt-1 text-3xl font-semibold">Code of Conduct</h1>
        <p className="mt-3 text-muted-foreground">
          By registering, every attendee, speaker and partner agrees to the rules below. Organisers may remove anyone
          who breaks them, without refund.
        </p>
      </header>
      <ol className="space-y-3">
        {RULES.map((r, i) => (
          <li key={r.title} className="surface flex gap-4 p-5">
            <span className="font-display text-lg font-semibold text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="text-base font-semibold">{r.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="rounded-xl bg-muted/60 p-5 text-sm">
        <strong>Need help or want to report something?</strong> Find any staff member in a navy lanyard, or contact us at{" "}
        <a className="font-semibold text-primary underline underline-offset-4" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{" "}
        or {CONTACT.phones[1]}. All reports are handled confidentially.
      </div>
    </article>
  );
}
