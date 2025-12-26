import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { log } from "console";

const FRONTEND_ROOT = "Frontend";
const LOG_FILE = "graphql-codegen.log";

// Logger (sync file logging)
fs.appendFileSync(
  LOG_FILE,
  `------------------------------------------- LOGS : [${new Date().toISOString()}] -----------------------------------------------------\n`
);
function writeLog(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(message);
}

function run(cmd, options = {}) {
  writeLog(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...options });
}

function hasCodegenConfig(appPath) {
  return fs.existsSync(path.join(appPath, "codegen.ts"));
}

function getFrontendApps() {
  return fs
    .readdirSync(FRONTEND_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(FRONTEND_ROOT, d.name));
}

function hasGitChanges(targetPath) {
  const output = execSync(`git status --porcelain ${targetPath}`, {
    encoding: "utf-8",
  });
  return output.trim().length > 0;
}

// GraphQL Change Detection
function normalizePath(p) {
  return p.replace(/\\/g, "/").toLowerCase();
}

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

// Matches **/graphql/**/*
function hasAnyGraphQLFolderChanges(changedFiles) {
  return changedFiles.some((file) => file.includes("/graphql/"));
}

//  Script start
writeLog("GraphQL codegen hook started");

const changedFiles = getGitChangedFiles();

if (!hasAnyGraphQLFolderChanges(changedFiles)) {
  writeLog("No GraphQL-related changes detected anywhere. Skipping codegen.");
  process.exit(0);
}

const appsWithCodegen = getFrontendApps().filter(hasCodegenConfig);

if (appsWithCodegen.length === 0) {
  writeLog("No frontend apps with GraphQL codegen found. Skipping.");
  process.exit(0);
}

appsWithCodegen.forEach((appPath) => {
  try {
    writeLog(`Running GraphQL codegen in ${appPath}`);

    run("npx graphql-codegen", { cwd: appPath });

    if (hasGitChanges(appPath)) {
      writeLog(`Staging generated GraphQL files in ${appPath}`);
      run(`git add ${appPath}`);
    } else {
      writeLog(`No generated changes in ${appPath}`);
    }
  } catch (error) {
    writeLog(`Codegen failed in ${appPath}`);
    writeLog(`Stopping commit process due to codegen failure`);
    process.exit(1);
  }
});

writeLog("GraphQL codegen completed successfully");
