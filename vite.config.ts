import { fileURLToPath } from "node:url";
import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite-plus";
import { folderPages } from "./plugins/folder-pages.ts";
import { soundMeta } from "./plugins/sound-meta.ts";

const soundsDir = fileURLToPath(new URL("./sounds", import.meta.url));

export default defineConfig({
  plugins: [solid(), folderPages(soundsDir), soundMeta(soundsDir)],
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
