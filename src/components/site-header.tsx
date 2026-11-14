import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { EVENT, getTier } from "@/lib/event";

export function SiteHeader() {
  const { profile, openApply, openSettings } = useAppState();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md @3xl:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <div className="min-w-0">
        <div className="truncate font-display text-base font-semibold leading-tight">{EVENT.name}</div>
        <div className="hidden items-center gap-3 text-xs text-muted-foreground @xl:flex">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" /> {EVENT.dates}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" /> {EVENT.city}
          </span>
        </div>
      </div>
      <div className="ml-auto">
        {profile.ticket ? (
          <Button variant="outline" size="sm" onClick={() => openSettings("ticket")}>
            <Ticket /> {getTier(profile.ticket).name}
          </Button>
        ) : (
          <Button variant="cta" size="sm" onClick={() => openApply()}>
            Grab your seat
          </Button>
        )}
      </div>
    </header>
  );
}
