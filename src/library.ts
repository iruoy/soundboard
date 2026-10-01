// Everything under /sounds is discovered at build time: drop a file or folder in and it shows up.

import durations from "virtual:sound-durations";

export interface Sound {
  name: string;
  url: string;
  /** Length in seconds, when it could be read at build time. */
  duration: number | undefined;
}

export interface Folder {
  slug: string;
  title: string;
  sounds: Sound[];
}

interface FolderMeta {
  title?: string;
  /** Display names by file name, for files whose name isn't a good title (e.g. `1.mp3`). */
  names?: Record<string, string>;
}

const audioUrls = import.meta.glob<string>("/sounds/*/*.{mp3,ogg,wav,m4a,opus,flac}", {
  eager: true,
  query: "?url",
  import: "default",
});

const metas = import.meta.glob<FolderMeta>("/sounds/*/folder.json", {
  eager: true,
  import: "default",
});

const compare = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare;

function titleFromSlug(slug: string): string {
  return slug.replace(/[_-]+/g, " ").replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

function nameFromFile(file: string): string {
  return file.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ");
}

function buildLibrary(): Folder[] {
  const folders = new Map<string, Folder>();

  for (const [path, url] of Object.entries(audioUrls)) {
    const [, , slug, file] = path.split("/") as [string, string, string, string];
    const meta = metas[`/sounds/${slug}/folder.json`];
    let folder = folders.get(slug);
    if (!folder) {
      folder = { slug, title: meta?.title ?? titleFromSlug(slug), sounds: [] };
      folders.set(slug, folder);
    }
    folder.sounds.push({
      name: meta?.names?.[file] ?? nameFromFile(file),
      url,
      duration: durations[path],
    });
  }

  for (const folder of folders.values()) {
    folder.sounds.sort((a, b) => compare(a.name, b.name));
  }

  return [...folders.values()].sort((a, b) => compare(a.title, b.title));
}

export const library: Folder[] = buildLibrary();

export function findFolder(slug: string): Folder | undefined {
  return library.find((folder) => folder.slug === slug);
}
