import { For } from "solid-js";
import { render } from "@solidjs/web";
import { SoundButton } from "./components/SoundButton.tsx";
import { findFolder } from "./library.ts";
import "./style.css";

// Each folder is served at /<slug>/ from the same page, so the URL says which one to show.
const slug = decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) ?? "");
const folder = findFolder(slug);

document.title = folder ? `${folder.title} · Soundboard` : "Not found · Soundboard";

function FolderPage() {
  return (
    <main class="page">
      <header class="header">
        <a class="back" href={import.meta.env.BASE_URL}>
          ← All folders
        </a>
        <h1>{folder?.title ?? "Folder not found"}</h1>
      </header>
      {folder && (
        <div class="sounds">
          <For each={folder.sounds}>{(sound) => <SoundButton sound={sound} />}</For>
        </div>
      )}
    </main>
  );
}

render(() => <FolderPage />, document.getElementById("app")!);
