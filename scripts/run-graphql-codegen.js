import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * ============================================================
 * CONFIG
 * =============================================
 */
const FRONTEND_ROOT = "Frontend";
const LOG_FILE = "graphql-codegen.log";

/**
 * ============================================================
 * SCRIPT ENTRY
 * ===========================================
 */

// Initialize log header for this run
initLog();

writeLog("GraphQL codegen hook started");

// 1. Detect staged git changes
const changedFiles = getGitChangedFiles();

// If nothing under any /graphql/ folder changed, skip completely
if (!hasAnyGraphQLFolderChanges(changedFiles)) {
  writeLog("No GraphQL-related changes detected anywhere. Skipping codegen.");
  process.exit(0);
}

// 2. Find frontend apps that have codegen config
const appsWithCodegen = getFrontendApps().filter(hasCodegenConfig);

if (appsWithCodegen.length === 0) {
  writeLog("No frontend apps with GraphQL codegen found. Skipping.");
  process.exit(0);
}

// 3. Run codegen per app and stage generated files if changed
for (const appPath of appsWithCodegen) {
  try {
    writeLog(`Running GraphQL codegen in ${appPath}`);

    run("npx graphql-codegen", { cwd: appPath });

    if (hasGitChanges(appPath)) {
      writeLog(`Staging generated GraphQL files in ${appPath}`);
      run(`git add ${appPath}`);
    } else {
      writeLog(`No generated changes in ${appPath}`);
    }
  } catch {
    writeLog(`Codegen failed in ${appPath}`);
    writeLog("Stopping commit process due to codegen failure");
    process.exit(1);
  }
}

writeLog("GraphQL codegen completed successfully");

/**
 * ===================================================
 * HELPER FUNCTIONS
 * ============================================================
 */

/**
 * Writes a visual separator so each hook run is easy to spot
 */
function initLog() {
  fs.appendFileSync(
    LOG_FILE,
    `\n------------------------------------------- LOGS : [${new Date().toISOString()}] -----------------------------------------------------\n`
  );
}

/**
 * Centralized logger:
 * - logs to file
 * - logs to console
 */
function writeLog(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(message);
}

/**
 * Runs a shell command and logs it before execution
 */
function run(cmd, options = {}) {
  writeLog(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...options });
}

/**
 * Checks if a frontend app has GraphQL codegen config
 */
function hasCodegenConfig(appPath) {
  return fs.existsSync(path.join(appPath, "codegen.ts"));
}

/**
 * Returns all first-level frontend app directories
 */
function getFrontendApps() {
  return fs
    .readdirSync(FRONTEND_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(FRONTEND_ROOT, d.name));
}

/**
 * Detects if there are any git changes under a given path
 */
function hasGitChanges(targetPath) {
  const output = execSync(`git status --porcelain ${targetPath}`, {
    encoding: "utf-8",
  });
  return output.trim().length > 0;
}

/**
 * Normalizes paths so Windows / Unix differences don’t break matching
 */
function normalizePath(p) {
  return p.replace(/\\/g, "/").toLowerCase();
}

/**
 * Reads staged git files (pre-commit safe)
 */
function getGitChangedFiles() {
  try {
    const output = execSync("git diff --cached --name-only", {
      encoding: "utf-8",
    });

    return output
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean)
      .map(normalizePath);
  } catch {
    return [];
  }
}

/**
 * Detects changes anywhere under any /graphql/ folder
 * Example match: src/graphql/operations/query.graphql
 */
function hasAnyGraphQLFolderChanges(changedFiles) {
  return changedFiles.some((file) => file.includes("/graphql/"));
}
