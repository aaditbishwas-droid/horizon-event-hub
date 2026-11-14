import { useEffect, useState, type ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ApplyDialog } from "@/components/apply-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { DevicePicker } from "@/components/device-picker";
import { AppStateProvider, useAppState, type DeviceMode } from "@/lib/app-state";
import { cn } from "@/lib/utils";

/** How each device choice shapes the frame around the page content. */
const LAYOUT: Record<DeviceMode, { inset: string; content: string }> = {
  mobile: { inset: "mx-auto max-w-[30rem] border-x shadow-soft", content: "max-w-none px-4 py-5" },
  tablet: { inset: "", content: "max-w-5xl px-5 py-6" },
  laptop: { inset: "", content: "max-w-6xl px-4 py-6 @3xl/main:px-8 @3xl/main:py-8" },
  desktop: { inset: "", content: "max-w-7xl px-6 py-8 @3xl/main:px-10 @3xl/main:py-10" },
};

function Frame({ children }: { children: ReactNode }) {
  const { device } = useAppState();
  const [open, setOpen] = useState(true);

  // Re-apply the sidebar default whenever the device choice changes.
  useEffect(() => {
    setOpen(device === "laptop" || device === "desktop");
  }, [device]);

  const layout = LAYOUT[device];

  return (
    <SidebarProvider forceMobile={device === "mobile"} open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset className={cn("@container/main min-w-0", layout.inset)}>
        <SiteHeader />
        <div className={cn("mx-auto w-full flex-1", layout.content)}>{children}</div>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <Frame>{children}</Frame>
      <ApplyDialog />
      <SettingsDialog />
      <DevicePicker />
      <Toaster position="top-center" />
    </AppStateProvider>
  );
}
