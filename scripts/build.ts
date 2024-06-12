import { execSync } from "child_process";

const { log } = console;

function runCommand(command: string) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(new Error(`Error executing command: ${command}`));
    process.exit(1);
  }
}

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

function main() {
  const startTime = Date.now();

  log(`\n🧹 ${GREEN}Cleaning${RESET}`);
  runCommand("npm run clean");

  log(`\n🔧 ${GREEN}Building ${BOLD}@generative-ts/core${RESET}`);
  runCommand("npm run build:rollup -w @generative-ts/core");

  log(`\n🔧 ${GREEN}Building ${BOLD}@generative-ts/google-vertex-ai${RESET}`);
  runCommand("npm run build:rollup -w @generative-ts/google-vertex-ai");

  log(`\n🔧 ${GREEN}Building ${BOLD}generative-ts${RESET}`);
  runCommand("npm run build:rollup -w generative-ts");

  const tookMs = Date.now() - startTime;

  log(`\n🎉 ${GREEN}Done (${tookMs}ms)${RESET}`);
}

main();
