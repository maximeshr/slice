import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const SKILL_NAMES = [
  "map",
  "align",
  "scope",
  "slice",
  "build",
  "review",
  "record",
  "reset",
];

const AGENT_NAMES = ["builder", "reviewer"];

export function resolveTargetDir(targetDir) {
  return path.resolve(targetDir ?? process.cwd());
}

export function copyDirectory(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    if (entry.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(sourcePath);
      fs.symlinkSync(linkTarget, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

export function createRelativeSymlink(linkPath, targetPath) {
  const linkDir = path.dirname(linkPath);
  fs.mkdirSync(linkDir, { recursive: true });

  const relativeTarget = path.relative(linkDir, targetPath);
  fs.symlinkSync(relativeTarget, linkPath);
}

export function removePathIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const stats = fs.lstatSync(filePath);
  if (stats.isDirectory() && !stats.isSymbolicLink()) {
    fs.rmSync(filePath, { recursive: true, force: true });
    return;
  }

  fs.unlinkSync(filePath);
}

export function linkToolDiscovery(targetDir, toolDirName) {
  const toolRoot = path.join(targetDir, toolDirName);

  for (const skillName of SKILL_NAMES) {
    const linkPath = path.join(toolRoot, "skills", skillName);
    const targetPath = path.join(targetDir, ".slice", "skills", skillName);
    removePathIfExists(linkPath);
    createRelativeSymlink(linkPath, targetPath);
  }

  for (const agentName of AGENT_NAMES) {
    const linkPath = path.join(toolRoot, "agents", `${agentName}.md`);
    const targetPath = path.join(
      targetDir,
      ".slice",
      "agents",
      `${agentName}.md`,
    );
    removePathIfExists(linkPath);
    createRelativeSymlink(linkPath, targetPath);
  }
}

export function writeAgentsFile(targetDir) {
  const agentsPath = path.join(targetDir, "AGENTS.md");

  if (fs.existsSync(agentsPath)) {
    return { action: "skipped", path: agentsPath };
  }

  const templatePath = path.join(PACKAGE_ROOT, "templates", "AGENTS.md");
  fs.copyFileSync(templatePath, agentsPath);
  return { action: "written", path: agentsPath };
}

export function linkClaudeMemory(targetDir, options) {
  const claudePath = path.join(targetDir, "CLAUDE.md");
  const agentsPath = path.join(targetDir, "AGENTS.md");

  if (!fs.existsSync(agentsPath)) {
    throw new Error("AGENTS.md must exist before linking CLAUDE.md");
  }

  if (fs.existsSync(claudePath)) {
    const stats = fs.lstatSync(claudePath);
    const alreadyLinked =
      stats.isSymbolicLink() &&
      path.resolve(path.dirname(claudePath), fs.readlinkSync(claudePath)) ===
        agentsPath;

    if (alreadyLinked) {
      return { action: "skipped", path: claudePath };
    }

    if (!options.force) {
      throw new Error(
        "CLAUDE.md already exists. Re-run with --force to replace it.",
      );
    }

    removePathIfExists(claudePath);
  }

  createRelativeSymlink(claudePath, agentsPath);
  return { action: "linked", path: claudePath };
}

export function installSliceFramework(targetDir, options = {}) {
  const resolvedTargetDir = resolveTargetDir(targetDir);
  const sliceTargetDir = path.join(resolvedTargetDir, ".slice");
  const sliceSourceDir = path.join(PACKAGE_ROOT, ".slice");

  if (!fs.existsSync(sliceSourceDir)) {
    throw new Error(`Bundled framework not found at ${sliceSourceDir}`);
  }

  if (fs.existsSync(sliceTargetDir) && !options.force) {
    throw new Error(
      ".slice/ already exists. Re-run with --force to replace it.",
    );
  }

  if (options.force && fs.existsSync(sliceTargetDir)) {
    fs.rmSync(sliceTargetDir, { recursive: true, force: true });
  }

  copyDirectory(sliceSourceDir, sliceTargetDir);

  const agents = writeAgentsFile(resolvedTargetDir);
  const claude = linkClaudeMemory(resolvedTargetDir, options);

  linkToolDiscovery(resolvedTargetDir, ".cursor");
  linkToolDiscovery(resolvedTargetDir, ".claude");

  return {
    targetDir: resolvedTargetDir,
    agents,
    claude,
    skills: SKILL_NAMES.length,
    agentsLinked: AGENT_NAMES.length,
  };
}
