import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarClock,
  ChevronsUpDown,
  LayoutDashboard,
  MonitorSmartphone,
  LifeBuoy,
  Mic2,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  Ticket,
  UserRound,
} from "lucide-react";

import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoMark } from "@/components/logo";
import { useAppState } from "@/lib/app-state";
import { CONTACT, EVENT, getTier } from "@/lib/event";
import { initials } from "@/lib/speakers";

const NAV = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Speakers", url: "/speakers", icon: Mic2 },
  { title: "Event Timeline", url: "/timeline", icon: CalendarClock },
  { title: "Code of Conduct", url: "/code-of-conduct", icon: ShieldCheck },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { profile, theme, toggleTheme, openSettings, setDevicePickerOpen } = useAppState();
  const { isMobile, setOpenMobile } = useSidebar();
  const ticketLabel = profile.ticket ? `${getTier(profile.ticket).name} ticket` : "Guest · no ticket";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
          <LogoMark className="size-8 shrink-0" />
          <span className="font-display text-base font-semibold tracking-tight text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
            Horizon
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Event</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV.map((item) => {
                const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className="h-10 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold"
                  >
                    <Link to={item.url} onClick={() => isMobile && setOpenMobile(false)}>
                      <item.icon className={active ? "text-sidebar-primary" : ""} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip="Account"
                  className="flex-1 data-[state=open]:bg-sidebar-accent"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg">{initials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-semibold text-sidebar-accent-foreground">
                      {profile.name}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/60">{ticketLabel}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 opacity-60" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-60 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-semibold">{profile.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{profile.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => openSettings("profile")}>
                  <UserRound /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openSettings("ticket")}>
                  <Ticket /> My ticket
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openSettings("profile")}>
                  <Settings /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDevicePickerOpen(true)}>
                  <MonitorSmartphone /> Change device view
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(EVENT.name + " support")}`}>
                    <LifeBuoy /> Help & support
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-primary"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
