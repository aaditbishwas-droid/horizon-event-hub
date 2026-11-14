import { Check, Plus } from "lucide-react";
import { PREVIOUS_PERKS } from "@/lib/event";
import { cn } from "@/lib/utils";

export function PerkList({ perks, compact = false, className }: { perks: string[]; compact?: boolean; className?: string }) {
  return (
    <ul className={cn(compact ? "space-y-1 text-xs" : "space-y-1.5 text-sm", className)}>
      {perks.map((p) =>
        p === PREVIOUS_PERKS ? (
          <li key={p} className="flex items-center gap-1.5 font-semibold text-brand">
            <Plus className="size-3.5 shrink-0" /> {p}
          </li>
        ) : (
          <li key={p} className="flex gap-1.5 text-muted-foreground">
            <Check className={cn("shrink-0 text-primary", compact ? "mt-0.5 size-3" : "mt-0.5 size-3.5")} />
            <span className="text-foreground/85">{p}</span>
          </li>
        ),
      )}
    </ul>
  );
}
