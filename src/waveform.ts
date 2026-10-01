// Draws a sound's waveform from the bar heights measured at build time (plugins/sound-meta.ts).

const HEIGHT = 32;
/** Every bar is at least this tall, so silent stretches still read as part of the wave. */
const MIN_HEIGHT = 2;

export function waveViewBox(peaks: number[]): string {
  return `0 0 ${peaks.length * 4} ${HEIGHT}`;
}

/** SVG path data for the bars, in a `waveViewBox` coordinate space. */
export function wavePath(peaks: number[]): string {
  return peaks
    .map((peak, i) => {
      const h = Math.max(MIN_HEIGHT, (peak / 100) * HEIGHT);
      return `M${i * 4} ${((HEIGHT - h) / 2).toFixed(2)}h2.4v${h.toFixed(2)}h-2.4z`;
    })
    .join("");
}
