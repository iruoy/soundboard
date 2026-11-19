# Soundboard

A static soundboard built with Solid 2, TypeScript 7 and Vite+.

## Adding sounds

Everything under `sounds/` is picked up at build time:

- Drop an audio file (`mp3`, `ogg`, `wav`, `m4a`, `opus`, `flac`) into `sounds/<folder>/` to add a sound. Its name is the file name, with underscores shown as spaces.
- Create a new directory in `sounds/` to add a folder. It gets its own page at `/<folder>/`.
- Optionally add `sounds/<folder>/folder.json` to override display names:
  ```json
  { "title": "Windows XP", "names": { "1.mp3": "5 euro's?" } }
  ```
  Without it, `windows_xp` becomes "Windows Xp" and each sound is named after its file.

## Playback

- Click: play. Click again while playing: stop and rewind.
- Hold (longer than 250 ms): plays while held, stops and rewinds on release.
- Enter / Space on a focused sound toggles it.
- Overlap (per browser, off by default): when off, starting a sound stops the others; when on, any number can play at once.
- Stop all stops every playing sound.
- The button in the top right cycles the theme: system, light, dark.

## Development

```sh
vp install
vp dev     # dev server
vp check   # format, lint and type check
vp test    # build-output and playback regression tests
vp build   # static site in dist/
```

The build embeds only titles and counts in the home page. Each board page includes its own sorted sound list, durations and waveforms. Audio stays in separate, content-hashed files: hovering over or playing a sound loads it, and repeat plays reuse a decoded-audio cache capped at 32 MiB. Active playback and pending decodes are separate from that limit.

`dist/` can be deployed to any static host. The site assumes it is served from the domain root; set `base` in `vite.config.ts` to serve it from a sub-path.

## Cloudflare Workers deployment

`wrangler.jsonc` configures the `soundboard` Worker to serve the static files in `dist/`, without a Worker script.

In Cloudflare Workers Builds, use:

- Build command: `pnpm run build`
- Deploy command: `pnpm dlx wrangler deploy`

Wrangler reads the Worker name, compatibility date and assets directory from the configuration file.
