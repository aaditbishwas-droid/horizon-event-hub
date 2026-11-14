import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, EVENT } from "@/lib/event";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="space-y-2">
          <div className="font-display text-sm font-semibold">{EVENT.name}</div>
          <p className="text-sm text-muted-foreground">
            {EVENT.dates} · {EVENT.city}. Four days of talks, workshops and real connections.
          </p>
        </div>

        <div className="space-y-3">
          <div className="eyebrow">Contact</div>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-sm hover:text-primary">
            <Mail className="size-4 text-muted-foreground" /> {CONTACT.email}
          </a>
          {CONTACT.phones.map((p) => (
            <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm hover:text-primary">
              <Phone className="size-4 text-muted-foreground" /> {p}
            </a>
          ))}
        </div>

        <div className="space-y-3">
          <div className="eyebrow">Venue & hours</div>
          <p className="flex gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> {CONTACT.address}
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-muted-foreground" /> {CONTACT.hours}
          </p>
        </div>

        <div className="space-y-3">
          <div className="eyebrow">Explore</div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/speakers" className="hover:text-primary">Speakers</Link>
            <Link to="/timeline" className="hover:text-primary">Event timeline</Link>
            <Link to="/code-of-conduct" className="hover:text-primary">Code of Conduct</Link>
          </nav>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between md:px-8">
          <span>© 2026 {EVENT.name}. All rights reserved.</span>
          <span>Support replies within one business day.</span>
        </div>
      </div>
    </footer>
  );
}
