#!/usr/bin/env node

import { installSliceFramework } from "../lib/init.js";

function printUsage() {
  console.log(`Usage: slice-workflow init [directory] [--force]

Install SLICE into a project:
  - copies .slice/
  - writes AGENTS.md (skipped if present)
  - links CLAUDE.md -> AGENTS.md
  - links .cursor/ and .claude/ skills and agents to .slice/
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    return { command: "help" };
  }

  const command = args[0];
  if (command !== "init") {
    return { command: "unknown", value: command };
  }

  const force = args.includes("--force");
  const positional = args.filter((arg) => arg !== "--force" && arg !== "init");

  return {
    command: "init",
    targetDir: positional[0],
    force,
  };
}

function main() {
  const parsed = parseArgs(process.argv);

  if (parsed.command === "help") {
    printUsage();
    return;
  }

  if (parsed.command === "unknown") {
    console.error(`Unknown command: ${parsed.value}`);
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    const result = installSliceFramework(parsed.targetDir, {
      force: parsed.force,
    });

    console.log(`SLICE installed in ${result.targetDir}`);
    console.log(`  .slice/ copied`);
    console.log(`  AGENTS.md ${result.agents.action}`);
    console.log(`  CLAUDE.md ${result.claude.action}`);
    console.log(
      `  linked ${result.skills} skills and ${result.agentsLinked} agents into .cursor/ and .claude/`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
