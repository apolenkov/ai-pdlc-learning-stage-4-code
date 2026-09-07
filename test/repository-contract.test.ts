import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { test } from "node:test";

const root = resolve(import.meta.dirname, "..");

async function assertMissing(relativePath: string): Promise<void> {
  await assert.rejects(
    access(join(root, relativePath)),
    (error: NodeJS.ErrnoException) => error.code === "ENOENT",
    `${relativePath} must not exist in the clean Stage 4 service template`
  );
}

test("OpenSpec root is only the declared product Store pointer", async () => {
  const openspecRoot = join(root, "openspec");
  const entries = (await readdir(openspecRoot)).sort();
  const config = await readFile(join(openspecRoot, "config.yaml"), "utf8");

  assert.deepEqual(entries, ["config.yaml"]);
  assert.equal(
    config,
    "schema: spec-driven\nstore: sdd-credit-calculator-product-meta\n"
  );
});

test("local planning and copied Stage 3 planning are unsupported", async () => {
  await Promise.all(
    [
      "openspec/specs",
      "openspec/changes",
      "docs/history",
      "docs/templates",
    ].map(assertMissing)
  );
});
