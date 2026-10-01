import { readdir, stat } from "node:fs/promises";
import { join, sep } from "node:path";
import { parseFile } from "music-metadata";
import type { Plugin } from "vite-plus";

const MODULE_ID = "virtual:sound-durations";
const RESOLVED_ID = `\0${MODULE_ID}`;
const AUDIO = /\.(mp3|ogg|wav|m4a|opus|flac)$/i;

/**
 * Exposes `virtual:sound-durations`: a map from `/sounds/<folder>/<file>` to its length in
 * seconds, read from the files at build time so pages can show lengths before any audio loads.
 */
export function soundDurations(soundsDir: string): Plugin {
  // Parsing scans the whole file for VBR mp3s, so remember results per path + mtime.
  const cache = new Map<string, { mtime: number; duration: number | undefined }>();

  async function duration(file: string): Promise<number | undefined> {
    const { mtimeMs } = await stat(file);
    const cached = cache.get(file);
    if (cached?.mtime === mtimeMs) return cached.duration;
    let seconds: number | undefined;
    try {
      seconds = (await parseFile(file, { duration: true, skipCovers: true })).format.duration;
    } catch {
      // Unreadable metadata: the page falls back to the decoded length on first play.
    }
    cache.set(file, { mtime: mtimeMs, duration: seconds });
    return seconds;
  }

  async function durations(): Promise<Record<string, number>> {
    const files = (await readdir(soundsDir, { recursive: true })).filter((file) =>
      AUDIO.test(file),
    );
    const entries = await Promise.all(
      files.map(async (file) => {
        const key = `/sounds/${file.split(sep).join("/")}`;
        return [key, await duration(join(soundsDir, file))] as const;
      }),
    );
    return Object.fromEntries(
      entries.filter((entry): entry is [string, number] => entry[1] !== undefined),
    );
  }

  return {
    name: "sound-durations",

    resolveId: (id) => (id === MODULE_ID ? RESOLVED_ID : undefined),

    async load(id) {
      if (id !== RESOLVED_ID) return;
      return `export default ${JSON.stringify(await durations())};`;
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
