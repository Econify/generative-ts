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
  console.log(`\n🖋️ \x1b[32mPublishing \x1b[1m${pkg}\x1b[0m`);
}

function main() {
  header("@generative-ts/core");
  runCommand("npm run publish:core");

  header("@generative-ts/google-vertex-ai");
  runCommand("npm run publish:vertexai");

  header("generative-ts");
  runCommand("npm run publish:main");
}

main();
