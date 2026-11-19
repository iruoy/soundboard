import decode from "@audio/decode";

/** Bars per waveform; the tiles draw one bar per value. */
const BARS = 48;

/** Measure the exact duration and the RMS loudness of each bar from the audio we will serve. */
export async function analyse(file: string, data: Uint8Array) {
  let channels: Float32Array[];
  let sampleRate: number;
  try {
    ({ channelData: channels, sampleRate } = await decode(data));
  } catch (error) {
    throw new Error(`Could not decode ${file}`, { cause: error });
  }
  const length = channels[0]?.length ?? 0;
  if (!length) throw new Error(`No audio in ${file}`);

  // RMS per bar reads as loudness; plain peaks make compressed clips look like solid blocks.
  const rms: number[] = [];
  for (let bar = 0; bar < BARS; bar++) {
    const start = Math.floor((bar * length) / BARS);
    const end = Math.max(Math.floor(((bar + 1) * length) / BARS), start + 1);
    let sum = 0;
    for (const channel of channels) {
      for (let i = start; i < end; i++) sum += channel[i]! * channel[i]!;
    }
    rms.push(Math.sqrt(sum / ((end - start) * channels.length)));
  }

  // Scale each sound to its own loudest bar, with a square root so quiet passages stay visible.
  const loudest = Math.max(...rms) || 1;
  return {
    duration: length / sampleRate,
    peaks: rms.map((value) => Math.round(Math.sqrt(value / loudest) * 100)),
  };
}
