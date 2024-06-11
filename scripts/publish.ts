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
  runCommand("npm run publish:core");
  runCommand("npm run publish:vertexai");
  runCommand("npm run publish:main");
}

main();
