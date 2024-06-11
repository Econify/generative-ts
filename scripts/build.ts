import { execSync } from "child_process";

function runCommand(command: string) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(new Error(`Error executing command: ${command}`));
    process.exit(1);
  }
}

function header(pkg: string) {
  console.log(`\n🔧 \x1b[32mBuilding \x1b[1m${pkg}\x1b[0m`);
}

function main() {
  console.log(`\n🧹 \x1b[32mCleaning\x1b[0m`);
  runCommand("npm run clean");

  header("@generative-ts/core");
  runCommand("npm run build:rollup -w @generative-ts/core");

  header("@generative-ts/google-vertex-ai");
  runCommand("npm run build:rollup -w @generative-ts/google-vertex-ai");

  header("generative-ts");
  runCommand("npm run build:rollup -w generative-ts");
}

main();
