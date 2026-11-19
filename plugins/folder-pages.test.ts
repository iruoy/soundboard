import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "vite-plus";
import { expect, it } from "vite-plus/test";
import type { Folder } from "../src/library.ts";
import { folderPages } from "./folder-pages.ts";

it("ships board summaries on the index and only local, playable sounds on each board", async () => {
  const root = await mkdtemp(join(tmpdir(), "board-build-"));
  const soundsDir = join(root, "sounds");
  const dist = join(root, "dist");
  const base = "/soundboard/";
  // Eight mono PCM samples at 8 kHz. Independent of the user's sound collection.
  const wav = Buffer.from(
    "UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRAAAAASNBI0EjQSNBI0EjQSNBI0",
    "base64",
  );
  const title = "A </script> & $&";
  const readData = async (page: string) => {
    const html = await readFile(join(dist, page), "utf8");
    return JSON.parse(html.match(/id="page-data">([^<]+)<\/script>/)![1]);
  };

  try {
    for (const slug of ["first", "other_board"])
      await mkdir(join(soundsDir, slug), { recursive: true });
    for (const page of ["index.html", "folder.html"])
      await writeFile(
        join(root, page),
        "<html><head><title>Soundboard</title></head><body></body></html>",
      );
    await writeFile(
      join(soundsDir, "first", "folder.json"),
      JSON.stringify({ title, names: { "10.wav": "Clip 10" } }),
    );
    await writeFile(join(soundsDir, "first", "Clip_2.wav"), wav);
    await writeFile(join(soundsDir, "first", "10.wav"), wav);
    await writeFile(join(soundsDir, "other_board", "Other, clip.wav"), wav);
    await build({
      root,
      base,
      configFile: false,
      logLevel: "silent",
      plugins: [folderPages(soundsDir)],
    });

    expect(await readData("index.html")).toEqual([
      { slug: "first", title, count: 2 },
      { slug: "other_board", title: "Other Board", count: 1 },
    ]);
    const first: Folder = await readData("first/index.html");
    const other: Folder = await readData("other_board/index.html");
    expect(first.title).toBe(title);
    expect(await readFile(join(dist, "first/index.html"), "utf8")).toContain(
      "<title>A &lt;/script&gt; &amp; $&amp; · Soundboard</title>",
    );
    expect(first.sounds.map((s) => s.name)).toEqual(["Clip 2", "Clip 10"]);
    expect(other.sounds.map((s) => s.name)).toEqual(["Other, clip"]);
    for (const sound of [...first.sounds, ...other.sounds]) {
      expect(sound.duration).toBe(0.001);
      expect(sound.peaks).toHaveLength(48);
      expect(sound.url).toMatch(/^\/soundboard\/assets\//);
      expect(await readFile(join(dist, decodeURIComponent(sound.url.slice(base.length))))).toEqual(
        wav,
      );
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
