import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  copyDirectory,
  installSliceFramework,
  linkClaudeMemory,
  writeAgentsFile,
} from "../lib/init.js";

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "slice-init-"));
}

test("installSliceFramework copies framework and links tool discovery", () => {
  const targetDir = createTempDir();

  const result = installSliceFramework(targetDir);

  assert.equal(result.agents.action, "written");
  assert.equal(result.claude.action, "linked");
  assert.ok(fs.existsSync(path.join(targetDir, ".slice", "SLICE.md")));
  assert.ok(fs.existsSync(path.join(targetDir, "AGENTS.md")));

  const claudeStats = fs.lstatSync(path.join(targetDir, "CLAUDE.md"));
  assert.ok(claudeStats.isSymbolicLink());

  const cursorSkill = path.join(targetDir, ".cursor", "skills", "build");
  const cursorAgent = path.join(targetDir, ".cursor", "agents", "builder.md");
  const claudeSkill = path.join(targetDir, ".claude", "skills", "build");
  const claudeAgent = path.join(targetDir, ".claude", "agents", "builder.md");

  for (const linkPath of [cursorSkill, cursorAgent, claudeSkill, claudeAgent]) {
    const stats = fs.lstatSync(linkPath);
    assert.ok(stats.isSymbolicLink());
    assert.ok(fs.existsSync(linkPath));
  }

  assert.ok(
    fs.existsSync(
      path.join(targetDir, ".cursor", "skills", "build", "SKILL.md"),
    ),
  );
});

test("installSliceFramework skips AGENTS.md when it already exists", () => {
  const targetDir = createTempDir();
  const agentsPath = path.join(targetDir, "AGENTS.md");
  fs.writeFileSync(agentsPath, "# custom agents\n");

  const result = installSliceFramework(targetDir);

  assert.equal(result.agents.action, "skipped");
  assert.equal(fs.readFileSync(agentsPath, "utf8"), "# custom agents\n");
});

test("installSliceFramework requires --force when .slice already exists", () => {
  const targetDir = createTempDir();
  installSliceFramework(targetDir);

  assert.throws(
    () => installSliceFramework(targetDir),
    /already exists/,
  );
});

test("installSliceFramework replaces .slice with --force", () => {
  const targetDir = createTempDir();
  installSliceFramework(targetDir);

  const markerPath = path.join(targetDir, ".slice", "SLICE.md");
  fs.writeFileSync(markerPath, "# stale\n");

  const result = installSliceFramework(targetDir, { force: true });

  assert.equal(result.agents.action, "skipped");
  assert.match(fs.readFileSync(markerPath, "utf8"), /lean, tool-agnostic/);
});

test("writeAgentsFile and linkClaudeMemory respect existing files", () => {
  const targetDir = createTempDir();
  fs.writeFileSync(path.join(targetDir, "AGENTS.md"), "# existing\n");
  fs.writeFileSync(path.join(targetDir, "CLAUDE.md"), "# stale\n");

  const agents = writeAgentsFile(targetDir);
  assert.equal(agents.action, "skipped");

  assert.throws(
    () => linkClaudeMemory(targetDir, { force: false }),
    /CLAUDE.md already exists/,
  );

  const claude = linkClaudeMemory(targetDir, { force: true });
  assert.equal(claude.action, "linked");
});

test("copyDirectory copies nested files", () => {
  const sourceDir = createTempDir();
  const targetDir = createTempDir();
  const nestedDir = path.join(sourceDir, "nested");
  fs.mkdirSync(nestedDir, { recursive: true });
  fs.writeFileSync(path.join(nestedDir, "file.txt"), "ok");

  copyDirectory(sourceDir, targetDir);

  assert.equal(
    fs.readFileSync(path.join(targetDir, "nested", "file.txt"), "utf8"),
    "ok",
  );
});
