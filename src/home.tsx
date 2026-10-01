import { For } from "solid-js";
import { render } from "@solidjs/web";
import { library } from "./library.ts";
import "./style.css";

function Home() {
  return (
    <main class="page">
      <header class="header">
        <h1>Soundboard</h1>
      </header>
      <ul class="folders">
        <For each={library}>
          {(folder) => (
            <li>
              <a class="folder" href={`${import.meta.env.BASE_URL}${folder.slug}/`}>
                <span class="folder-title">{folder.title}</span>
                <span class="folder-count">{folder.sounds.length} sounds</span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}

render(() => <Home />, document.getElementById("app")!);
