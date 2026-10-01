import { readdir, readFile, stat } from "node:fs/promises";
import { join, sep } from "node:path";
import decode from "@audio/decode";
import type { Plugin } from "vite-plus";

const MODULE_ID = "virtual:sound-meta";
const RESOLVED_ID = `\0${MODULE_ID}`;
const AUDIO = /\.(mp3|ogg|wav|m4a|opus|flac)$/i;

/** Bars per waveform; the tiles draw one bar per value. */
const BARS = 48;

export interface SoundMeta {
  /** Length in seconds. */
  duration: number;
  /** Loudness per bar, 0–100, relative to the loudest bar of the same sound. */
  peaks: number[];
}

/** Decodes a sound and summarises it: its exact length and a waveform of `BARS` bars. */
async function analyse(file: string): Promise<SoundMeta> {
  let channels: Float32Array[];
  let sampleRate: number;
  try {
    ({ channelData: channels, sampleRate } = await decode(await readFile(file)));
  } catch (error) {
    throw new Error(`Could not decode ${file}`, { cause: error });
  }
  const length = channels[0]?.length ?? 0;
  if (!length) throw new Error(`No audio in ${file}`);

  // RMS per bar reads as loudness; plain peaks make compressed clips look like solid blocks.
  const rms: number[] = [];
  for (let bar = 0; bar < BARS; bar++) {
    const start = Math.floor((bar * length) / BARS);
    const end = Math.max(Math.floor(((bar + 1) * length) / BARS), start + 1);
    let sum = 0;
    for (const channel of channels) {
      for (let i = start; i < end; i++) sum += channel[i]! * channel[i]!;
    }
    rms.push(Math.sqrt(sum / ((end - start) * channels.length)));
  }

  // Scale each sound to its own loudest bar, with a square root so quiet passages stay visible.
  const loudest = Math.max(...rms) || 1;
  return {
    duration: length / sampleRate,
    peaks: rms.map((value) => Math.round(Math.sqrt(value / loudest) * 100)),
  };
}

/**
 * Exposes `virtual:sound-meta`: a map from `/sounds/<folder>/<file>` to its length and
 * waveform, read from the files at build time so pages can show both before any audio loads.
 * A sound that can't be decoded fails the build.
 */
export function soundMeta(soundsDir: string): Plugin {
  // Decoding is the slow part of a build, so remember results per path + mtime.
  const cache = new Map<string, { mtime: number; meta: Promise<SoundMeta> }>();

  async function meta(file: string): Promise<SoundMeta> {
    const { mtimeMs } = await stat(file);
    const cached = cache.get(file);
    if (cached?.mtime === mtimeMs) return cached.meta;
    const result = analyse(file);
    cache.set(file, { mtime: mtimeMs, meta: result });
    result.catch(() => cache.delete(file));
    return result;
  }

  async function all(): Promise<Record<string, SoundMeta>> {
    const files = (await readdir(soundsDir, { recursive: true })).filter((file) =>
      AUDIO.test(file),
    );
    const entries = await Promise.all(
      files.map(async (file) => {
        const key = `/sounds/${file.split(sep).join("/")}`;
        return [key, await meta(join(soundsDir, file))] as const;
      }),
    );
    return Object.fromEntries(entries);
  }

  return {
    name: "sound-meta",

    resolveId: (id) => (id === MODULE_ID ? RESOLVED_ID : undefined),

    async load(id) {
      if (id !== RESOLVED_ID) return;
      return `export default ${JSON.stringify(await all())};`;
    },

    configureServer(server) {
      const refresh = (file: string) => {
        if (!AUDIO.test(file) || !file.startsWith(soundsDir)) return;
        const module = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (module) void server.reloadModule(module);
      };
      server.watcher.on("add", refresh).on("change", refresh).on("unlink", refresh);
    },
  };
}
