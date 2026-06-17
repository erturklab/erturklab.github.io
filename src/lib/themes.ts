export type ThemeId = "dark" | "light" | "midnight" | /* "slate" | "warm" | */ "paper";

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  preview: { bg: string; fg: string; accent: string };
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: "dark", label: "Obsidian", description: "Default dark — gold accents", preview: { bg: "#0c0c0e", fg: "#e4e4e7", accent: "#c9a26a" } },
  { id: "light", label: "Daylight", description: "Clean white UI", preview: { bg: "#fafafa", fg: "#18181b", accent: "#b08d4f" } },
  { id: "midnight", label: "Midnight", description: "Deep blue-black", preview: { bg: "#070b14", fg: "#dbeafe", accent: "#60a5fa" } },
  // { id: "slate", label: "Slate", description: "Cool gray professional", preview: { bg: "#111318", fg: "#e2e8f0", accent: "#94a3b8" } },
  // { id: "warm", label: "Ember", description: "Warm dark brown tones", preview: { bg: "#14100c", fg: "#f5ebe0", accent: "#d97706" } },
  { id: "paper", label: "Paper", description: "Soft cream / sepia light", preview: { bg: "#f7f3eb", fg: "#292524", accent: "#a16207" } },
];

export const STORAGE_KEY_THEME = "erturk-lab-theme";
export const ALL_THEME_CLASSES = THEME_OPTIONS.map((t) => t.id);

export function applyTheme(theme: ThemeId): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove(...ALL_THEME_CLASSES);
  document.documentElement.classList.add(theme);
}

export function loadStoredTheme(): ThemeId {
  if (typeof localStorage === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeId | null;
  return saved && THEME_OPTIONS.some((t) => t.id === saved) ? saved : "dark";
}

export function saveTheme(theme: ThemeId): void {
  localStorage.setItem(STORAGE_KEY_THEME, theme);
  applyTheme(theme);
}
