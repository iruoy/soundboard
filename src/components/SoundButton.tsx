import { createMemo, createSignal, onSettled } from "solid-js";
import { load, play, type Playback } from "../audio.ts";
import type { Sound } from "../library.ts";

/** Presses longer than this count as "hold": releasing stops the sound. Shorter presses are clicks. */
const HOLD_MS = 250;

function formatTime(seconds: number): string {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function SoundButton(props: { sound: Sound }) {
  const [playing, setPlaying] = createSignal(false);
  const [position, setPosition] = createSignal(0);
  // The decoded length is exact; the build-time one lets us show something before any audio loads.
  const [decodedDuration, setDecodedDuration] = createSignal<number>();
  const duration = createMemo(() => decodedDuration() ?? props.sound.duration);
  const progress = createMemo(() => {
    const total = duration();
    return total ? Math.min(position() / total, 1) : 0;
  });

  let playback: Playback | undefined;
  let frame = 0;
  // Time of the press that started the current playback, or undefined if this press stopped it.
  let pressedAt: number | undefined;

  const tick = () => {
    if (!playback) return;
    setPosition(playback.position());
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    const current: Playback = play(props.sound.url, setDecodedDuration, () => {
      if (playback !== current) return;
      playback = undefined;
      cancelAnimationFrame(frame);
      setPlaying(false);
      setPosition(0);
    });
    playback = current;
    setPlaying(true);
    frame = requestAnimationFrame(tick);
  };

  const stop = () => playback?.stop();

  const toggle = () => (playback ? stop() : start());

  onSettled(() => () => {
    cancelAnimationFrame(frame);
    stop();
  });

  return (
    <button
      type="button"
      class={["sound", { playing: playing() }]}
      aria-pressed={playing() ? "true" : "false"}
      onPointerEnter={() => void load(props.sound.url).catch(() => {})}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        if (playback) {
          stop();
          pressedAt = undefined;
        } else {
          start();
          pressedAt = event.timeStamp;
        }
      }}
      onPointerUp={(event) => {
        if (pressedAt !== undefined && event.timeStamp - pressedAt >= HOLD_MS) stop();
        pressedAt = undefined;
      }}
      onPointerCancel={() => {
        // The browser took over the gesture (e.g. a scroll on touch screens): treat it as accidental.
        if (pressedAt !== undefined) stop();
        pressedAt = undefined;
      }}
      onClick={(event) => {
        // Pointer presses are handled above; this only catches keyboard activation (Enter / Space).
        if (event.detail === 0) toggle();
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span class="sound-name">{props.sound.name}</span>
      <span class="sound-time">
        {formatTime(position())} /{" "}
        {duration() === undefined ? "–:––" : formatTime(Math.ceil(duration()!))}
      </span>
      <span class="sound-progress" style={{ transform: `scaleX(${progress()})` }} />
    </button>
  );
}
