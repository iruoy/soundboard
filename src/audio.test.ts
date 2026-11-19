import { afterEach, expect, it, vi } from "vite-plus/test";

// Only metadata is needed to exercise the 32 MiB PCM budget; don't allocate the samples.
function pcm(mib = 1, channels = 1) {
  const length = (mib * 1024 * 1024) / (channels * Float32Array.BYTES_PER_ELEMENT);
  return { length, numberOfChannels: channels, duration: length / 48000 };
}

function source() {
  return {
    buffer: null as ReturnType<typeof pcm> | null,
    onended: null as (() => void) | null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
  };
}

async function setup() {
  vi.resetModules(); // Each test gets a fresh page's cache and AudioContext.
  const fetch = vi.fn(async () => new Response(new ArrayBuffer(1)));
  const decode = vi.fn(async () => pcm());
  const sources: ReturnType<typeof source>[] = [];
  const clock = { now: 0 };
  vi.stubGlobal("fetch", fetch);
  vi.stubGlobal("navigator", {});
  vi.stubGlobal(
    "AudioContext",
    class {
      state = "running";
      destination = {};
      decodeAudioData = decode;
      get currentTime() {
        return clock.now;
      }
      createBufferSource() {
        const node = source();
        sources.push(node);
        return node;
      }
    },
  );
  return { ...(await import("./audio.ts")), fetch, decode, sources, clock };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("counts PCM across channels, refreshes hits, and evicts as many oldest clips as needed", async () => {
  const { load, decode, fetch } = await setup();
  decode
    .mockResolvedValueOnce(pcm(16, 2))
    .mockResolvedValueOnce(pcm(8))
    .mockResolvedValueOnce(pcm(8, 2))
    .mockResolvedValueOnce(pcm(16, 2));
  const a = await load("a");
  const b = await load("b");
  const c = await load("c");
  expect(await load("a")).toBe(a); // Exactly at budget; order now b, c, a.
  const d = await load("d");
  expect(await load("a")).toBe(a);
  expect(await load("d")).toBe(d);
  const [newB, newC] = await Promise.all([load("b"), load("c")]);
  expect(newB).not.toBe(b);
  expect(newC).not.toBe(c);
  expect(fetch).toHaveBeenCalledTimes(6);
  expect(decode).toHaveBeenCalledTimes(6);
});

it("keeps a pending decode shared under pressure and returns an oversized clip without caching it", async () => {
  const { load, decode, fetch } = await setup();
  let finish!: (buffer: ReturnType<typeof pcm>) => void;
  decode
    .mockImplementationOnce(() => new Promise((resolve) => (finish = resolve)))
    .mockResolvedValueOnce(pcm(32))
    .mockResolvedValueOnce(pcm(32));
  const pending = load("huge");
  await load("old");
  const hot = await load("hot");
  expect(load("huge")).toBe(pending);
  const huge = pcm(33);
  finish(huge);
  expect(await pending).toBe(huge);
  expect(await load("hot")).toBe(hot);
  expect(await load("huge")).not.toBe(huge);
  expect(fetch).toHaveBeenCalledTimes(4);
});

it("allows retry after HTTP and decode errors and ends a failed play once", async () => {
  const { load, play, fetch, decode, sources } = await setup();
  fetch.mockResolvedValueOnce(new Response(null, { status: 503 }));
  await expect(load("a")).rejects.toThrow("503");
  expect(decode).not.toHaveBeenCalled();

  vi.spyOn(console, "error").mockImplementation(() => {});
  decode.mockRejectedValueOnce(new Error("bad clip"));
  const ended = vi.fn();
  const failed = play("a", ended);
  await expect(load("a")).rejects.toThrow("bad clip");
  expect(ended).toHaveBeenCalledTimes(1);
  failed.stop();
  expect(ended).toHaveBeenCalledTimes(1);
  expect(sources).toHaveLength(0);
  await load("a");
  expect(fetch).toHaveBeenCalledTimes(3);
  expect(decode).toHaveBeenCalledTimes(2);
});

it("can stop and immediately replay during preload without starting the stopped play", async () => {
  const { load, play, sources, decode, fetch } = await setup();
  const preload = load("a");
  const ended = vi.fn();
  const first = play("a", ended);
  expect(first.position()).toBe(0);
  first.stop();
  const replayEnded = vi.fn();
  play("a", replayEnded);
  const buffer = await preload;
  expect(ended).toHaveBeenCalledTimes(1);
  expect(sources).toHaveLength(1);
  expect(sources[0].buffer).toBe(buffer);
  expect(sources[0].start).toHaveBeenCalledWith();
  expect(replayEnded).not.toHaveBeenCalled();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(decode).toHaveBeenCalledTimes(1);
});

it("overlaps independent sources and keeps them playing across eviction and reload", async () => {
  const { load, play, sources, clock, decode } = await setup();
  decode.mockResolvedValueOnce(pcm(32));
  const firstEnd = vi.fn();
  const first = play("a", firstEnd);
  const a = await load("a");
  clock.now = 1;
  const secondEnd = vi.fn();
  const second = play("a", secondEnd);
  await load("a");
  await load("other"); // Evict a while both sources still use it.
  expect(await load("a")).not.toBe(a);
  expect(decode).toHaveBeenCalledTimes(3);
  expect(sources).toHaveLength(2);
  for (const node of sources) {
    expect(node.buffer).toBe(a);
    expect(node.start).toHaveBeenCalledWith();
    expect(node.stop).not.toHaveBeenCalled();
    expect(node.disconnect).not.toHaveBeenCalled();
  }
  clock.now = 3;
  expect(first.position()).toBe(3);
  expect(second.position()).toBe(2);
  first.stop();
  expect(sources[0].stop).toHaveBeenCalledOnce();
  expect(firstEnd).toHaveBeenCalledOnce();
  expect(sources[1].stop).not.toHaveBeenCalled();
  expect(secondEnd).not.toHaveBeenCalled();
  sources[1].onended?.();
  expect(secondEnd).toHaveBeenCalledOnce();
});
