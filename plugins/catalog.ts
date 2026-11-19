import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BoardSummary, Folder, Sound } from "../src/library.ts";

const AUDIO = /\.(mp3|ogg|wav|m4a|opus|flac)$/i;
const compare = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare;

interface Board extends BoardSummary {
  files: { file: string; name: string }[];
}

interface FolderMeta {
  title?: string;
  names?: Record<string, string>;
}

/** Discovery needs only directory listings and optional display names, never audio bytes. */
export async function discover(soundsDir: string): Promise<Board[]> {
  const dirs = (await readdir(soundsDir, { withFileTypes: true })).filter((dir) =>
    dir.isDirectory(),
  );
  const boards = await Promise.all(
    dirs.map(async ({ name: slug }) => {
      const dir = join(soundsDir, slug);
      const entries = (await readdir(dir, { withFileTypes: true })).filter((entry) =>
        entry.isFile(),
      );
      const meta: FolderMeta = entries.some((entry) => entry.name === "folder.json")
        ? JSON.parse(await readFile(join(dir, "folder.json"), "utf8"))
        : {};
      const files = entries
        .filter((entry) => AUDIO.test(entry.name))
        .map(({ name: file }) => ({
          file,
          name: meta.names?.[file] ?? file.replace(/\.[^.]+$/, "").replace(/_+/g, " "),
        }))
        .sort((a, b) => compare(a.name, b.name));
      const title =
        meta.title ?? slug.replace(/[_-]+/g, " ").replace(/\b\p{L}/gu, (c) => c.toUpperCase());
      return { slug, title, count: files.length, files };
    }),
  );
  return boards.sort((a, b) => compare(a.title, b.title));
}

export function summaries(boards: Board[]): BoardSummary[] {
  return boards
    .filter((board) => board.count)
    .map(({ slug, title, count }) => ({ slug, title, count }));
}

export async function folderData(
  board: Board | undefined,
  load: (file: string, slug: string) => Promise<Omit<Sound, "name">>,
): Promise<Folder | null> {
  if (!board?.count) return null;
  const sounds: Sound[] = [];
  // One decode at a time bounds peak PCM memory even on very large boards.
  for (const { file, name } of board.files)
    sounds.push({ name, ...(await load(file, board.slug)) });
  return { slug: board.slug, title: board.title, sounds };
}

export function withPageData(html: string, data: BoardSummary[] | Folder | null): string {
  // Script elements are raw text even for JSON: a display name must not close the element.
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");
  return html.replace(
    "</head>",
    () => `<script type="application/json" id="page-data">${json}</script>\n</head>`,
  );
}
