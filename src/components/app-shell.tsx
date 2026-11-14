import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ApplyDialog } from "@/components/apply-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { AppStateProvider } from "@/lib/app-state";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
          <SiteFooter />
        </SidebarInset>
      </SidebarProvider>
      <ApplyDialog />
      <SettingsDialog />
      <Toaster position="top-center" />
    </AppStateProvider>
  );
}
