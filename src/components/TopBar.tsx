import type { JSX } from "@solidjs/web";
import { ThemeToggle } from "../theme.tsx";

/** The amber bar across the top of every page: the site name on the left, controls on the right. */
export function TopBar(props: { back?: boolean; children?: JSX.Element }) {
  return (
    <div class={["bar", { sticky: props.back }]}>
      {props.back ? (
        <a class="brand" href={import.meta.env.BASE_URL}>
          <span class="brand-arrow">←</span>
          <span class="pixel">Soundboard</span>
        </a>
      ) : (
        <div class="brand pixel">Soundboard</div>
      )}
      <div class="bar-controls">
        {props.children}
        <ThemeToggle />
      </div>
    </div>
  );
}
