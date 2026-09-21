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

test("developer handoff reuses the prepared canonical checkouts", async () => {
  const [readme, handoff, manifest] = await Promise.all([
    readFile(join(root, "README.md"), "utf8"),
    readFile(join(root, "docs/developer-handoff.md"), "utf8"),
    readFile(join(root, "package.json"), "utf8"),
  ]);
  const legacyRepositoryNames =
    /sdd-credit-calculator-(?:example|stage-4-example|product-meta-example)/u;

  assert.doesNotMatch(readme, legacyRepositoryNames);
  assert.doesNotMatch(handoff, legacyRepositoryNames);
  assert.equal(
    JSON.parse(manifest).name,
    "sdd-guide-credit-calculator-stage-4-code"
  );
  assert.match(
    handoff,
    /CODE_DIR=.*sdd-guide-credit-calculator-stage-4-code/u
  );
  assert.match(handoff, /Если подготовленной папки кода нет/u);
  assert.equal(handoff.match(/^set -eu$/gmu)?.length, 2);
  assert.match(handoff, /meta_status="\$\(git -C "\$META_DIR" status/u);
  assert.match(handoff, /code_status="\$\(git -C "\$CODE_DIR" status/u);
  assert.doesNotMatch(handoff, /test -z "\$\(git .* status/u);
  assert.match(
    handoff,
    /`PLANNING_SHA`.*итогов.*R4.*не.*исходн.*R3.*не.*`IMPORT_BASE_SHA`/su
  );
});
