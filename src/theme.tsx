import { createSignal } from "solid-js";

// The stored theme is applied by an inline script in each page's <head>, before first paint.
// Without one, the page follows the system setting through `prefers-color-scheme`.

type Mode = "system" | "light" | "dark";

const STORAGE_KEY = "sb-theme";
const NEXT: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<Mode, string> = { system: "System", light: "Light", dark: "Dark" };

function storedMode(): Mode {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    // Storage can be blocked (e.g. some private modes): fall back to the system theme.
  }
  return "system";
}

const [mode, setMode] = createSignal<Mode>(storedMode());

function cycle() {
  const next = NEXT[mode()];
  try {
    if (next === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisted, but still applied to this page.
  }
  if (next === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = next;
  setMode(next);
}

export function ThemeToggle() {
  const label = () => `Theme: ${LABEL[mode()]} — switch to ${LABEL[NEXT[mode()]]}`;
  return (
    <button
      type="button"
      class="bar-button theme-toggle"
      title={label()}
      aria-label={label()}
      onClick={cycle}
    >
      <span class={["theme-icon", mode()]} />
    </button>
  );
}
