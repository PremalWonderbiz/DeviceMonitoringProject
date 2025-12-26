#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("Setting up Git Hooks...");

try {
  // Check if git is available
  execSync("git --version", { stdio: "ignore" });

  // Set hooks path (cross-platform)
  execSync("git config core.hooksPath .githooks", { stdio: "inherit" });

  // Make hooks executable (Unix-like systems only)
  if (process.platform !== "win32") {
    const hooksDir = path.join(__dirname, "..", ".githooks");

    // Check if directory exists
    if (!fs.existsSync(hooksDir)) {
      throw new Error(".githooks directory not found");
    }

    // Read all files in the directory
    const entries = fs.readdirSync(hooksDir, { withFileTypes: true });

    // Filter only files (not directories)
    const hookFiles = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);

    // Make each hook file executable
    hookFiles.forEach((hook) => {
      const hookPath = path.join(hooksDir, hook);
      try {
        fs.chmodSync(hookPath, "755");
        console.log(`Made ${hook} executable`);
      } catch (err) {
        console.warn(`Could not make ${hook} executable:`, err.message);
      }
    });

    console.log(`Made ${hookFiles.length} hook(s) executable`);
  }

  console.log("Git hooks installed successfully!");
  console.log("\nTo bypass hooks: git commit --no-verify");
} catch (error) {
  console.error("Failed to setup git hooks:", error.message);
  process.exit(1);
}

// to check if the hooksPath is set correctly
// git config --get core.hooksPath

// reset to default hooks path
// git config --unset core.hooksPath
