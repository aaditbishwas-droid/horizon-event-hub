import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { TierId } from "./event";
import defaultAvatar from "@/assets/avatar-guest.jpg";

export type Profile = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  ticket: TierId | null;
};

const DEFAULT_PROFILE: Profile = {
  name: "Maya Laurent",
  email: "maya.laurent@example.com",
  phone: "",
  avatar: defaultAvatar,
  ticket: null,
};

export type SettingsTab = "profile" | "contact" | "ticket";

type AppState = {
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  applyOpen: boolean;
  applyTier: TierId | null;
  openApply: (tier?: TierId) => void;
  setApplyOpen: (open: boolean) => void;
  settingsOpen: boolean;
  settingsTab: SettingsTab;
  openSettings: (tab?: SettingsTab) => void;
  setSettingsOpen: (open: boolean) => void;
};

const Ctx = createContext<AppState | null>(null);
const PROFILE_KEY = "horizon-profile";
const THEME_KEY = "horizon-theme";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyTier, setApplyTier] = useState<TierId | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("profile");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(saved) });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      } catch {
        /* storage full (large photo) — keep in memory */
      }
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const openApply = useCallback((tier?: TierId) => {
    setApplyTier(tier ?? null);
    setApplyOpen(true);
  }, []);

  const openSettings = useCallback((tab: SettingsTab = "profile") => {
    setSettingsTab(tab);
    setSettingsOpen(true);
  }, []);

  return (
    <Ctx.Provider
      value={{
        profile,
        updateProfile,
        theme,
        toggleTheme,
        applyOpen,
        applyTier,
        openApply,
        setApplyOpen,
        settingsOpen,
        settingsTab,
        openSettings,
        setSettingsOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

/** Runs before paint so the saved theme never flashes. */
export const THEME_BOOT_SCRIPT = `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;
