import { For } from "solid-js";
import { render } from "@solidjs/web";
import { TopBar } from "./components/TopBar.tsx";
import { readPageData, type BoardSummary } from "./library.ts";
import "./style.css";

const library = readPageData<BoardSummary[]>();
const total = library.reduce((sum, folder) => sum + folder.count, 0);

function Home() {
  return (
    <main class="page">
      <header class="hero">
        <TopBar>
          <span class="mono">{total} sounds</span>
        </TopBar>
        <div class="hero-body">
          <div class="kicker">Boards</div>
          <h1 class="pixel">Pick a board</h1>
          <p class="hero-text">All the best sounds in one place. Tap a board to open it.</p>
        </div>
      </header>
      <nav class="grid">
        <For each={library}>
          {(folder, index) => (
            <a
              class="tile board"
              href={`${import.meta.env.BASE_URL}${encodeURIComponent(folder.slug)}/`}
            >
              <span class="tile-meta">
                <span>{String(index() + 1).padStart(2, "0")}</span>
                <span>{folder.count} sounds</span>
              </span>
              <span class="board-footer">
                <span class="board-title">{folder.title}</span>
                <span class="board-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </a>
          )}
        </For>
      </nav>
    </main>
  );
}

render(() => <Home />, document.getElementById("app")!);
