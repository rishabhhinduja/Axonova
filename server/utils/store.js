import fs from "node:fs/promises";
import path from "node:path";

const STORE_PATH = path.resolve(process.cwd(), "server/data/store.json");

export async function readStore() {
  const raw = await fs.readFile(STORE_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function writeStore(nextData) {
  const serialized = JSON.stringify(nextData, null, 2);
  await fs.writeFile(STORE_PATH, serialized, "utf-8");
}

export function safePercent(numerator, denominator) {
  if (!denominator) {
    return 0;
  }
  return Math.round((numerator / denominator) * 100);
}
