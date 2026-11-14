import { useEffect, useState } from "react";
import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { detectDevice, useAppState, type DeviceMode } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const OPTIONS: { id: DeviceMode; label: string; hint: string; icon: typeof Smartphone }[] = [
  { id: "mobile", label: "Mobile", hint: "Single column, menu tucked away", icon: Smartphone },
  { id: "tablet", label: "Tablet", hint: "Slim icon sidebar, roomy cards", icon: Tablet },
  { id: "laptop", label: "Laptop", hint: "Full sidebar, balanced layout", icon: Laptop },
  { id: "desktop", label: "Desktop", hint: "Wide layout, larger text", icon: Monitor },
];

export function DevicePicker() {
  const { devicePickerOpen, setDevicePickerOpen, device, setDevice } = useAppState();
  const [detected, setDetected] = useState<DeviceMode>("laptop");
  const [choice, setChoice] = useState<DeviceMode>(device);

  useEffect(() => {
    if (devicePickerOpen) {
      const d = detectDevice();
      setDetected(d);
      setChoice(localStorage.getItem("horizon-device") ? device : d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicePickerOpen]);

  const confirm = (mode: DeviceMode) => {
    setDevice(mode);
    setDevicePickerOpen(false);
  };

  return (
    <Dialog open={devicePickerOpen} onOpenChange={(o) => (o ? setDevicePickerOpen(true) : confirm(choice))}>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Which device are you on?</DialogTitle>
          <DialogDescription>We'll arrange the dashboard to fit. You can change this anytime from your profile menu.</DialogDescription>
        </DialogHeader>
        <div role="radiogroup" aria-label="Device" className="grid grid-cols-2 gap-3">
          {OPTIONS.map((o) => {
            const active = choice === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setChoice(o.id)}
                onDoubleClick={() => confirm(o.id)}
                className={cn(
                  "relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                  active ? "border-primary bg-accent ring-1 ring-primary" : "hover:border-ring/50",
                )}
              >
                {detected === o.id && (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                    Detected
                  </span>
                )}
                <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                  <o.icon className="size-5" />
                </span>
                <span className="font-semibold">{o.label}</span>
                <span className="text-xs text-muted-foreground">{o.hint}</span>
              </button>
            );
          })}
        </div>
        <Button variant="cta" size="lg" className="w-full" onClick={() => confirm(choice)}>
          Continue with {OPTIONS.find((o) => o.id === choice)?.label}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
