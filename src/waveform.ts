// A decorative waveform per sound: seeded by its name, so it looks the same on every visit
// without having to load the audio first.

const BARS = 48;
const HEIGHT = 32;
export const WAVE_VIEWBOX = `0 0 ${BARS * 4} ${HEIGHT}`;

function hash(text: string): number {
  let h = 7;
  for (const c of text) h = (h * 31 + c.codePointAt(0)!) >>> 0;
  return h;
}

/** SVG path data for the bars, in a `WAVE_VIEWBOX` coordinate space. */
export function wavePath(seed: string): string {
  let state = hash(seed);
  const random = () => (state = (state * 1664525 + 1013904223) >>> 0) / 4294967296;
  const peak = 0.3 + random() * 0.5;
  let path = "";
  for (let i = 0; i < BARS; i++) {
    const x = i / (BARS - 1);
    const envelope = Math.exp(-Math.pow((x - peak) / 0.32, 2)) * 0.8 + 0.2;
    const h = Math.max(2, HEIGHT * envelope * (0.35 + 0.65 * random()));
    path += `M${i * 4} ${((HEIGHT - h) / 2).toFixed(2)}h2.4v${h.toFixed(2)}h-2.4z`;
  }
  return path;
}
