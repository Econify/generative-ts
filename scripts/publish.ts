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
  log(`\n🧹 ${GREEN}Cleaning${RESET}`);
  runCommand("npm run clean");

  log(`\n🚀 ${GREEN}Publishing ${BOLD}@generative-ts/core${RESET}`);
  runCommand("npm publish -w @generative-ts/core");

  log(`\n🚀 ${GREEN}Publishing ${BOLD}@generative-ts/gcloud-vertex-ai${RESET}`);
  runCommand("npm publish -w @generative-ts/gcloud-vertex-ai");

  log(`\n🚀 ${GREEN}Publishing ${BOLD}generative-ts${RESET}`);
  runCommand("npm publish -w generative-ts");

  log(`\n🎉 ${GREEN}Done${RESET}`);
}

main();
