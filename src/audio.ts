// Web Audio playback: near-instant starts and any number of overlapping sounds.

let context: AudioContext | undefined;
const buffers = new Map<string, Promise<AudioBuffer>>();

function getContext(): AudioContext {
  if (!context) {
    // Let iOS play through the silent switch, like a media app would.
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = "playback";

    context = new AudioContext({ latencyHint: "interactive" });
  }
  return context;
}

/** Fetch and decode a sound once; later calls reuse the same buffer. */
export function load(url: string): Promise<AudioBuffer> {
  let buffer = buffers.get(url);
  if (!buffer) {
    buffer = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
        return response.arrayBuffer();
      })
      .then((data) => getContext().decodeAudioData(data));
    buffer.catch(() => buffers.delete(url));
    buffers.set(url, buffer);
  }
  return buffer;
}

export interface Playback {
  /** Seconds played so far; 0 while the sound is still loading. */
  position(): number;
  /** Stops immediately; the next play starts from the beginning again. */
  stop(): void;
}

/**
 * Starts playing as soon as the sound is decoded. `onStart` receives the decoded length in
 * seconds. `onEnd` fires once, whether the sound finished by itself, was stopped, or failed to load.
 */
export function play(
  url: string,
  onStart: (duration: number) => void,
  onEnd: () => void,
): Playback {
  const ctx = getContext();
  // Browsers start the context suspended until a user gesture; resuming from within one unlocks it.
  if (ctx.state !== "running") void ctx.resume();
  let source: AudioBufferSourceNode | undefined;
  let startedAt = 0;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    onEnd();
  };

  load(url).then(
    (buffer) => {
      if (done) return;
      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = finish;
      source.start();
      startedAt = ctx.currentTime;
      onStart(buffer.duration);
    },
    (error: unknown) => {
      console.error(error);
      finish();
    },
  );

  return {
    position() {
      return source?.buffer ? Math.min(ctx.currentTime - startedAt, source.buffer.duration) : 0;
    },
    stop() {
      if (source) {
        source.onended = null;
        source.stop();
        source.disconnect();
      }
      finish();
    },
  };
}
