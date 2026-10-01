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
vp build   # static site in dist/
```

`dist/` can be deployed to any static host. The site assumes it is served from the domain root; set `base` in `vite.config.ts` to serve it from a sub-path.
