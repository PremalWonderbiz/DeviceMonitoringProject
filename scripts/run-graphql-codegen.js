import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const FRONTEND_ROOT = "Frontend";
const LOG_FILE = "graphql-codegen.log";

// --------------------------------------------------
// Logger (overwrite file on every run)
// --------------------------------------------------
const logStream = fs.createWriteStream(LOG_FILE, { flags: "w" });

function writeLog(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  logStream.write(line);

  // Optional: also print to console
  console.log(message);
}

function run(cmd, options = {}) {
  writeLog(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...options });
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function hasCodegenConfig(appPath) {
  return fs.existsSync(path.join(appPath, "codegen.yml"));
}

function getFrontendApps() {
  return fs
    .readdirSync(FRONTEND_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(FRONTEND_ROOT, d.name));
}

function hasGitChanges(targetPath) {
  try {
    execSync(`git diff --quiet ${targetPath}`, { stdio: "ignore" });
    return false;
  } catch {
    return true;
  }
}

function hasCodegenScript(appPath) {
  const pkgPath = path.join(appPath, "package.json");
  if (!fs.existsSync(pkgPath)) return false;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  return Boolean(pkg.scripts?.codegen);
}

// --------------------------------------------------
// Script start
// --------------------------------------------------
writeLog("GraphQL codegen hook started");

const appsWithCodegen = getFrontendApps().filter(hasCodegenConfig);

if (appsWithCodegen.length === 0) {
  writeLog("No frontend apps with GraphQL codegen found. Skipping.");
  logStream.end();
  process.exit(0);
}

appsWithCodegen.forEach((appPath) => {
  try {
    writeLog(`Running GraphQL codegen in ${appPath}`);

    if (hasCodegenScript(appPath)) {
      run("npm run codegen", { cwd: appPath });
    } else {
      writeLog(
        `No codegen script found in ${appPath}, falling back to npx graphql-codegen`
      );
      run("npx graphql-codegen", { cwd: appPath });
    }

    if (hasGitChanges(appPath)) {
      writeLog(`Staging generated GraphQL files in ${appPath}`);
      run(`git add ${appPath}`);
    } else {
      writeLog(`No generated changes in ${appPath}`);
    }
  } catch (error) {
    writeLog(`Codegen failed in ${appPath}`);
    logStream.end();
    process.exit(1);
  }
});

writeLog("GraphQL codegen completed successfully");
logStream.end();
