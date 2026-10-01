import { fileURLToPath } from "node:url";
import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite-plus";
import { folderPages } from "./plugins/folder-pages.ts";
import { soundDurations } from "./plugins/sound-durations.ts";

const soundsDir = fileURLToPath(new URL("./sounds", import.meta.url));

export default defineConfig({
  plugins: [solid(), folderPages(soundsDir), soundDurations(soundsDir)],
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
