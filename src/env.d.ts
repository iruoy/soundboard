declare module "virtual:sound-meta" {
  import type { SoundMeta } from "../plugins/sound-meta.ts";
  /** Length and waveform, keyed by `/sounds/<folder>/<file>`. */
  const soundMeta: Record<string, SoundMeta>;
  export default soundMeta;
}
