import { For } from "solid-js";
import { render } from "@solidjs/web";
import { SoundButton } from "./components/SoundButton.tsx";
import { TopBar } from "./components/TopBar.tsx";
import { findFolder } from "./library.ts";
import { overlap, playingCount, setOverlap, stopAll } from "./player.ts";
import "./style.css";

// Each folder is served at /<slug>/ from the same page, so the URL says which one to show.
const slug = decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) ?? "");
const folder = findFolder(slug);

document.title = folder ? `${folder.title} · Soundboard` : "Not found · Soundboard";

function FolderPage() {
  const count = folder?.sounds.length ?? 0;
  return (
    <main class="page">
      <TopBar back>
        <button
          type="button"
          class={["bar-button", "stop-all", { live: playingCount() > 0 }]}
          disabled={playingCount() === 0}
          onClick={() => stopAll()}
        >
          <span class="stop-icon" />
          <span>Stop all</span>
          <span class="mono stop-count">{playingCount() || ""}</span>
        </button>
      </TopBar>
      <header class="hero">
        <div class="hero-body">
          <div class="kicker">Board</div>
          <h1 class="pixel">{folder?.title ?? "Board not found"}</h1>
          {folder && (
            <div class="hero-row">
              <span class="mono">
                {count} {count === 1 ? "sound" : "sounds"}
              </span>
              <div class="overlap">
                <span class="kicker" id="overlap-label">
                  Overlap
                </span>
                <div class="segmented" role="group" aria-labelledby="overlap-label">
                  <button
                    type="button"
                    aria-pressed={overlap() ? "false" : "true"}
                    onClick={() => setOverlap(false)}
                  >
                    Off
                  </button>
                  <button
                    type="button"
                    aria-pressed={overlap() ? "true" : "false"}
                    onClick={() => setOverlap(true)}
                  >
                    On
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      {folder && (
        <div class="grid">
          <For each={folder.sounds}>
            {(sound, index) => <SoundButton sound={sound} index={index()} />}
          </For>
        </div>
      )}
    </main>
  );
}

render(() => <FolderPage />, document.getElementById("app")!);
