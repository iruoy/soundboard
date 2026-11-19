export interface Sound {
  name: string;
  url: string;
  /** Length in seconds. */
  duration: number;
  /** Waveform bar heights, 0–100. */
  peaks: number[];
}

export interface BoardSummary {
  slug: string;
  title: string;
  count: number;
}

export interface Folder {
  slug: string;
  title: string;
  sounds: Sound[];
}

/** The build embeds only the data for this page; no manifest request on the critical path. */
export function readPageData<T>(): T {
  return JSON.parse(document.getElementById("page-data")!.textContent!) as T;
}
