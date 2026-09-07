import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const openSpecEntrypoint = resolve(
  root,
  "node_modules",
  "@fission-ai",
  "openspec",
  "bin",
  "openspec.js"
);

type StoreRoot = {
  path?: unknown;
  source?: unknown;
  store_id?: unknown;
};

type OpenSpecResult = {
  changes?: unknown;
  root?: StoreRoot;
};

function runJson(arguments_: string[]): OpenSpecResult {
  const result = spawnSync(process.execPath, [openSpecEntrypoint, ...arguments_], {
    cwd: root,
    encoding: "utf8",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `OpenSpec ${arguments_.join(" ")} failed (${result.status ?? "unknown"}):\n${result.stderr || result.stdout}`
    );
  }

  return JSON.parse(result.stdout) as OpenSpecResult;
}

function declaredRoot(result: OpenSpecResult, command: string): StoreRoot {
  assert.equal(result.root?.source, "declared", `${command}: root.source`);
  assert.equal(
    result.root?.store_id,
    "sdd-credit-calculator-product-meta",
    `${command}: root.store_id`
  );
  assert.equal(typeof result.root?.path, "string", `${command}: root.path`);
  assert.ok((result.root?.path as string).length > 0, `${command}: root.path`);
  assert.ok(Array.isArray(result.changes), `${command}: changes`);
  return result.root;
}

const listRoot = declaredRoot(runJson(["list", "--json"]), "list");
const statusRoot = declaredRoot(
  runJson(["status", "--all", "--json"]),
  "status --all"
);

assert.equal(statusRoot.path, listRoot.path, "list/status Store root mismatch");
console.log(
  "Store pointer verified: declared sdd-credit-calculator-product-meta is available."
);
