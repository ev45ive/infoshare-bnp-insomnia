import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Typed in-memory store backed by a Map keyed by entity id. */
export class Store<T extends { id: string }> {
  private items: Map<string, T>;

  constructor(seed: T[] = []) {
    this.items = new Map(seed.map((item) => [item.id, item]));
  }

  /** Underlying map (for rest-helpers). */
  get map(): Map<string, T> {
    return this.items;
  }

  values(): T[] {
    return [...this.items.values()];
  }

  /** Reset to a fresh seed (demo /admin/reset). */
  reset(seed: T[]): void {
    this.items = new Map(seed.map((item) => [item.id, item]));
  }
}

/** Load and parse a JSON seed file from data/. */
export function loadSeed<T>(fileName: string): T[] {
  const path = join(__dirname, "..", "data", fileName);
  return JSON.parse(readFileSync(path, "utf8")) as T[];
}
