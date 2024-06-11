import { execSync } from "child_process";

function runCommand(command: string) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(new Error(`Error executing command: ${command}`));
    process.exit(1);
  }
}

function main() {
  runCommand("npm run clean");
  runCommand("npm run build:core");
  runCommand("npm run build:vertexai");
  runCommand("npm run build:main");
}

main();
