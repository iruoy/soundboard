declare module "virtual:sound-durations" {
  /** Length in seconds, keyed by `/sounds/<folder>/<file>`. Missing if it couldn't be read. */
  const durations: Record<string, number>;
  export default durations;
}
