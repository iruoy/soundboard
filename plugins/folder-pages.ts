import { realpathSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";
import type { Plugin } from "vite-plus";
import {
  discover,
  folderData,
  pageDescription,
  pageTitle,
  summaries,
  withPageData,
} from "./catalog.ts";
import { analyse } from "./sound-meta.ts";

/** Serve and build the same static pages: a small board index, and one catalog per folder. */
export function folderPages(directory: string): Plugin {
  // Match the canonical paths Vite reports in file watcher events.
  const soundsDir = realpathSync(directory);
  let base: string;
  const encodePath = (path: string) =>
    encodeURI(path).replaceAll("?", "%3F").replaceAll("#", "%23");

  function slugFromUrl(url: string) {
    const path = url.split(/[?#]/, 1)[0];
    if (!path.startsWith(base)) return;
    const slug = path.slice(base.length).match(/^([^/]+)\/?$/)?.[1];
    if (slug) return decodeURIComponent(slug);
  }

  let catalog: ReturnType<typeof discover> | undefined;
  const devBoards = () => (catalog ??= discover(soundsDir));
  const devCache = new Map<string, ReturnType<typeof analyse>>();
  function devMeta(file: string) {
    let meta = devCache.get(file);
    if (!meta) {
      meta = readFile(file).then((data) => analyse(file, data));
      devCache.set(file, meta);
      meta.catch(() => {
        if (devCache.get(file) === meta) devCache.delete(file);
      });
    }
    return meta;
  }

  return {
    name: "folder-pages",
    config: (config) => {
      const root = resolve(config.root ?? process.cwd());
      return {
        build: {
          // The CSS already needs browsers that support modulepreload natively.
          modulePreload: { polyfill: false },
          rolldownOptions: {
            input: { index: resolve(root, "index.html"), folder: resolve(root, "folder.html") },
          },
        },
      };
    },
    configResolved(config) {
      base = config.base;
    },

    configureServer(server) {
      server.watcher.add(soundsDir).on("all", (_event, file) => {
        if (!file.startsWith(soundsDir + sep)) return;
        catalog = undefined;
        devCache.delete(file);
        server.ws.send({ type: "full-reload" });
      });
      server.middlewares.use(async (req, _res, next) => {
        try {
          const slug = slugFromUrl(req.url ?? "");
          if (slug && (await devBoards()).some((board) => board.slug === slug)) {
            req.url = `${base}folder.html`;
          }
          next();
        } catch (error) {
          next(error);
        }
      });
    },

    async transformIndexHtml(html, ctx) {
      if (!ctx.server) return;
      const slug = slugFromUrl(ctx.originalUrl ?? ctx.path);
      const boards = await devBoards();
      if (basename(ctx.filename) !== "folder.html") return withPageData(html, summaries(boards));
      const board = boards.find((board) => board.slug === slug);
      const folder = await folderData(board, async (file, slug) => ({
        ...(await devMeta(join(soundsDir, slug, file))),
        url: `${base}sounds/${encodePath(`${slug}/${file}`)}`,
      }));
      return withPageData(html, folder, {
        title: pageTitle(folder),
        description: pageDescription(folder),
      });
    },

    generateBundle: {
      // The two processed HTML templates (including Vite's preload links) are ready here.
      order: "post",
      async handler(_options, bundle) {
        const index = bundle["index.html"];
        const page = bundle["folder.html"];
        if (index?.type !== "asset" || page?.type !== "asset") return;
        this.addWatchFile(soundsDir);
        const boards = await discover(soundsDir);
        const assetBase = base === "./" || base === "" ? "../" : base;
        const fonts = Object.values(bundle)
          .filter((item) => item.type === "asset" && item.fileName.endsWith(".woff2"))
          .map((item) => encodePath(item.fileName))
          .sort();
        index.source = withPageData(String(index.source), summaries(boards), {
          fonts: fonts.map((file) => base + file),
        });
        delete bundle["folder.html"];
        for (const board of boards) {
          const dir = join(soundsDir, board.slug);
          this.addWatchFile(dir);
          const folder = await folderData(board, async (file) => {
            const path = join(dir, file);
            this.addWatchFile(path);
            const data = await readFile(path);
            const ref = this.emitFile({
              type: "asset",
              name: file,
              originalFileName: relative(process.cwd(), path),
              source: data,
            });
            return {
              ...(await analyse(path, data)),
              url: assetBase + encodePath(this.getFileName(ref)),
            };
          });
          this.emitFile({
            type: "asset",
            fileName: `${board.slug}/index.html`,
            source: withPageData(String(page.source), folder, {
              title: pageTitle(folder),
              description: pageDescription(folder),
              fonts: fonts.map((file) => assetBase + file),
            }),
          });
        }
      },
    },
  };
}
