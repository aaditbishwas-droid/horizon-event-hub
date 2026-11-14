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
export type DeviceMode = "mobile" | "tablet" | "laptop" | "desktop";

/** Best guess from the screen the page is open on. */
export function detectDevice(): DeviceMode {
  if (typeof window === "undefined") return "laptop";
  const w = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (w < 768) return "mobile";
  if (w < 1024 || (coarse && w < 1366)) return "tablet";
  if (w < 1600) return "laptop";
  return "desktop";
}

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
  device: DeviceMode;
  setDevice: (device: DeviceMode) => void;
  devicePickerOpen: boolean;
  setDevicePickerOpen: (open: boolean) => void;
};

const Ctx = createContext<AppState | null>(null);
const PROFILE_KEY = "horizon-profile";
const THEME_KEY = "horizon-theme";
const DEVICE_KEY = "horizon-device";
const DEVICES: DeviceMode[] = ["mobile", "tablet", "laptop", "desktop"];

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyTier, setApplyTier] = useState<TierId | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("profile");
  const [device, setDeviceState] = useState<DeviceMode>("laptop");
  const [devicePickerOpen, setDevicePickerOpen] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    try {
      const savedDevice = localStorage.getItem(DEVICE_KEY) as DeviceMode | null;
      if (savedDevice && DEVICES.includes(savedDevice)) setDeviceState(savedDevice);
      else {
        setDeviceState(detectDevice());
        setDevicePickerOpen(true);
      }
    } catch {
      setDeviceState(detectDevice());
    }
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

  const setDevice = useCallback((next: DeviceMode) => {
    setDeviceState(next);
    document.documentElement.dataset["device"] = next;
    try {
      localStorage.setItem(DEVICE_KEY, next);
    } catch {
      /* ignore */
    }
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
        device,
        setDevice,
        devicePickerOpen,
        setDevicePickerOpen,
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
export const THEME_BOOT_SCRIPT = `try{var d=document.documentElement;if(localStorage.getItem("${THEME_KEY}")==="dark")d.classList.add("dark");var v=localStorage.getItem("${DEVICE_KEY}");if(v)d.dataset.device=v}catch(e){}`;
