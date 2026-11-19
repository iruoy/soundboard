import { flush } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import type { Playback } from "./audio.ts";
import { overlap, playingCount, setOverlap, stopAll, track, untrack } from "./player.ts";

function fakePlayback(): Playback & { stop: ReturnType<typeof vi.fn> } {
  // Like real playback: stopping fires onEnd, which untracks (see SoundButton).
  const playback: Playback & { stop: ReturnType<typeof vi.fn> } = {
    position: () => 0,
    stop: vi.fn(() => untrack(playback)),
  };
  return playback;
}

afterEach(() => {
  stopAll();
  setOverlap(true);
  flush();
});

describe("player", () => {
  it("counts live playbacks", () => {
    const a = fakePlayback();
    const b = fakePlayback();
    track(a);
    track(b);
    flush();
    expect(playingCount()).toBe(2);
    untrack(a);
    flush();
    expect(playingCount()).toBe(1);
    stopAll();
    flush();
    expect(b.stop).toHaveBeenCalledOnce();
    expect(playingCount()).toBe(0);
  });

  it("turning overlap off keeps only the most recent sound", () => {
    const a = fakePlayback();
    const b = fakePlayback();
    const c = fakePlayback();
    track(a);
    track(b);
    track(c);
    setOverlap(false);
    flush();
    expect(overlap()).toBe(false);
    expect(a.stop).toHaveBeenCalledOnce();
    expect(b.stop).toHaveBeenCalledOnce();
    expect(c.stop).not.toHaveBeenCalled();
    expect(playingCount()).toBe(1);
  });

  it("stopAll can keep one playback alive", () => {
    const a = fakePlayback();
    const b = fakePlayback();
    track(a);
    track(b);
    stopAll(b);
    flush();
    expect(a.stop).toHaveBeenCalledOnce();
    expect(b.stop).not.toHaveBeenCalled();
    expect(playingCount()).toBe(1);
  });
});
