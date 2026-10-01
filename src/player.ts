// Page-wide playback state: which sounds are playing, and whether they may overlap.

import { createSignal } from "solid-js";
import type { Playback } from "./audio.ts";

const OVERLAP_KEY = "sb-overlap";

// Insertion order is start order, so the last entry is the most recently started sound.
const live = new Set<Playback>();
const [playingCount, setPlayingCount] = createSignal(0);

function storedOverlap(): boolean {
  try {
    return localStorage.getItem(OVERLAP_KEY) === "on";
  } catch {
    return false;
  }
}

const [overlap, setOverlapSignal] = createSignal(storedOverlap());

export { overlap, playingCount };

export function track(playback: Playback) {
  live.add(playback);
  setPlayingCount(live.size);
}

export function untrack(playback: Playback) {
  live.delete(playback);
  setPlayingCount(live.size);
}

/** Stops every playing sound, except `keep` when given. */
export function stopAll(keep?: Playback) {
  for (const playback of live) if (playback !== keep) playback.stop();
}

export function setOverlap(value: boolean) {
  try {
    localStorage.setItem(OVERLAP_KEY, value ? "on" : "off");
  } catch {
    // Not persisted, but still applied to this page.
  }
  // Turning overlap off leaves only the most recently started sound playing.
  if (!value) stopAll([...live].at(-1));
  setOverlapSignal(value);
}
