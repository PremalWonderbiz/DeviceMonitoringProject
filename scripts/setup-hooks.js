#!/usr/bin/env node
/**
 * Local-only Git hooks setup.
 * Safe to run multiple times and must never break npm install.
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const log = (msg) => console.log(`${msg}`);
const warn = (msg) => console.warn(`${msg}`);

const run = (cmd, options = {}) =>
  execSync(cmd, { stdio: "ignore", ...options });

try {
  log("Initializing git hooks setup");

  // Skip in CI – hooks are for local development only
  if (process.env.CI) {
    log("CI detected. Skipping hooks setup.");
    process.exit(0);
  }

  // Always operate from repo root
  const repoRoot = path.resolve(__dirname, "..");
  process.chdir(repoRoot);

  // Git must be available
  try {
    run("git --version");
  } catch {
    warn("Git not found. Skipping hooks setup.");
    process.exit(0);
  }

  // Skip if not a git repository
  if (!fs.existsSync(path.join(repoRoot, ".git"))) {
    warn("Not a git repository. Skipping hooks setup.");
    process.exit(0);
  }

  const hooksDir = path.join(repoRoot, ".githooks");

  // Hooks directory must exist
  if (!fs.existsSync(hooksDir)) {
    warn("`.githooks` directory missing. Skipping setup.");
    process.exit(0);
  }

  // Configure hooks path only if needed
  let currentHooksPath = "";
  try {
    currentHooksPath = execSync("git config --get core.hooksPath", {
      encoding: "utf8",
    }).trim();
  } catch {}

  if (currentHooksPath !== ".githooks") {
    run("git config core.hooksPath .githooks", { stdio: "inherit" });
    log("Git hooks path configured.");
  } else {
    log("Git hooks already configured.");
  }

  // Ensure hooks are executable on Unix systems
  if (process.platform !== "win32") {
    fs.readdirSync(hooksDir, { withFileTypes: true })
      .filter((e) => e.isFile())
      .forEach((e) => {
        const file = path.join(hooksDir, e.name);
        try {
          const stat = fs.statSync(file);
          if (!(stat.mode & 0o111)) fs.chmodSync(file, 0o755);
        } catch {
          warn(`Permission check failed for ${e.name}`);
        }
      });

    log("Hook permissions verified.");
  }

  log("Git hooks setup completed.");
  log("Bypass hooks with: git commit --no-verify");
} catch (err) {
  // Never block installation
  warn(`Hooks setup skipped: ${err.message}`);
  process.exit(0);
}

// to check if the hooksPath is set correctly
// git config --get core.hooksPath

// reset to default hooks path
// git config --unset core.hooksPath
