import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite-plus";

/**
 * Serves `folder.html` at `/<folder>/` for every directory in `soundsDir`, and emits a copy
 * at `<folder>/index.html` in the build so any static host can serve the same URLs.
 */
export function folderPages(soundsDir: string): Plugin {
  const folders = () =>
    readdirSync(soundsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

  return {
    name: "folder-pages",

    config: (config) => {
      const root = resolve(config.root ?? process.cwd());
      return {
        build: {
          // Keep every sound a separate file, fetched only when it's about to be played.
          assetsInlineLimit: 0,
          rolldownOptions: {
            input: { index: resolve(root, "index.html"), folder: resolve(root, "folder.html") },
          },
        },
      };
    },

    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const slug = req.url?.match(/^\/([^/?#.]+)\/?(?:[?#].*)?$/)?.[1];
        if (slug && folders().includes(decodeURIComponent(slug))) req.url = "/folder.html";
        next();
      });
    },

    generateBundle: {
      // Vite emits the HTML pages in its own generateBundle hook, so run after it.
      order: "post",
      handler(_options, bundle) {
        const page = bundle["folder.html"];
        if (page?.type !== "asset") return;
        delete bundle["folder.html"];
        for (const slug of folders()) {
          this.emitFile({ type: "asset", fileName: `${slug}/index.html`, source: page.source });
        }
      },
    },
  };
}
