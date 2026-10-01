import { createMemo, createSignal, onSettled } from "solid-js";
import { load, play, type Playback } from "../audio.ts";
import type { Sound } from "../library.ts";
import { overlap, stopAll, track, untrack } from "../player.ts";
import { waveViewBox, wavePath } from "../waveform.ts";

/** Presses longer than this count as "hold": releasing stops the sound. Shorter presses are clicks. */
const HOLD_MS = 250;

function formatTime(seconds: number): string {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function SoundButton(props: { sound: Sound; index: number }) {
  const [playing, setPlaying] = createSignal(false);
  const [position, setPosition] = createSignal(0);
  const progress = createMemo(() => Math.min(position() / props.sound.duration, 1));

  // Time left while playing, the full length otherwise.
  const time = createMemo(() => {
    const total = props.sound.duration;
    return formatTime(Math.ceil(playing() ? Math.max(total - position(), 0) : total));
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

  const wave = createMemo(() => wavePath(props.sound.peaks));

  const start = () => {
    if (!overlap()) stopAll();
    const current: Playback = play(props.sound.url, () => {
      untrack(current);
      if (playback !== current) return;
      playback = undefined;
      cancelAnimationFrame(frame);
      setPlaying(false);
      setPosition(0);
    });
    playback = current;
    track(current);
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
      <span class="sound-meta">
        <span>{String(props.index + 1).padStart(2, "0")}</span>
        <span>{time()}</span>
      </span>
      <span class="sound-name">{props.sound.name}</span>
      <span class="wave" aria-hidden="true">
        <svg viewBox={waveViewBox(props.sound.peaks)} preserveAspectRatio="none">
          <path d={wave()} />
        </svg>
        <svg
          class="wave-progress"
          viewBox={waveViewBox(props.sound.peaks)}
          preserveAspectRatio="none"
          style={{ "clip-path": `inset(0 ${100 - progress() * 100}% 0 0)` }}
        >
          <path d={wave()} />
        </svg>
      </span>
    </button>
  );
}
