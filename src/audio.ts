// Web Audio playback: near-instant starts and any number of overlapping sounds.

let context: AudioContext | undefined;
// Bounds reusable PCM (~87 seconds of stereo at 48 kHz), not in-flight decodes or live sources.
const PCM_BUDGET = 32 * 1024 * 1024;
const pending = new Map<string, Promise<AudioBuffer>>();
const decoded = new Map<string, AudioBuffer>(); // Oldest use first.
let decodedBytes = 0;

function pcmBytes(buffer: AudioBuffer): number {
  return buffer.length * buffer.numberOfChannels * Float32Array.BYTES_PER_ELEMENT;
}

function remember(url: string, buffer: AudioBuffer): void {
  const bytes = pcmBytes(buffer);
  if (bytes > PCM_BUDGET) return; // Play it without displacing reusable clips.

  for (const [key, oldest] of decoded) {
    if (decodedBytes + bytes <= PCM_BUDGET) break;
    decoded.delete(key); // Playing sources keep their own reference.
    decodedBytes -= pcmBytes(oldest);
  }
  decoded.set(url, buffer);
  decodedBytes += bytes;
}

function getContext(): AudioContext {
  if (!context) {
    // Let iOS play through the silent switch, like a media app would.
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = "playback";

    context = new AudioContext({ latencyHint: "interactive" });
  }
  return context;
}

/** Share in-flight fetches/decodes and reuse recently loaded sounds. */
export function load(url: string): Promise<AudioBuffer> {
  const cached = decoded.get(url);
  if (cached) {
    decoded.delete(url);
    decoded.set(url, cached);
    return Promise.resolve(cached);
  }

  const loading = pending.get(url);
  if (loading) return loading;

  const result = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
      return response.arrayBuffer();
    })
    .then((data) => getContext().decodeAudioData(data))
    .then((buffer) => {
      remember(url, buffer);
      return buffer;
    })
    .finally(() => pending.delete(url));
  pending.set(url, result);
  return result;
}

export interface Playback {
  /** Seconds played so far; 0 while the sound is still loading. */
  position(): number;
  /** Stops immediately; the next play starts from the beginning again. */
  stop(): void;
}

/**
 * Starts playing as soon as the sound is decoded. `onEnd` fires once, whether the sound
 * finished by itself, was stopped, or failed to load.
 */
export function play(url: string, onEnd: () => void): Playback {
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
