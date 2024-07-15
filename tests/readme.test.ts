import * as fs from "fs";
import * as path from "path";

/*
  This script reads the README.md file, extracts code snippets marked with <!-- TEST [label] --> and runs them as Jest tests.
  It's kind of weird and meant to be used as a one-off manual verification step when snippets are changed in the README.
*/

const readmePath = path.join(__dirname, "../README.md");

const readmeContent = fs.readFileSync(readmePath, "utf-8");

const annotatedCodeBlockRegex =
  /<!-- TEST \[([^\]]+)\] -->\s*```ts\s*([\s\S]*?)```/g;
let match;
const codeSnippets: { label: string; code: string }[] = [];

// eslint-disable-next-line no-cond-assign
while ((match = annotatedCodeBlockRegex.exec(readmeContent)) !== null) {
  codeSnippets.push({ label: match[1] as string, code: match[2] as string });
}

// Replace import statements with require statements
function transpile(code: string): string {
  const importRegex = /import\s*{\s*([\s\S]+?)\s*}\s*from\s*['"]([^'"]+)['"];/g;
  return code.replace(
    importRegex,
    (_match: string, imports: string, module: string): string => {
      const transformedImports = imports
        .split(",")
        .map((importName) => importName.trim())
        .map(
          (importName) =>
            `const ${importName} = require('${module}').${importName};`,
        )
        .join("\n");
      return transformedImports;
    },
  );
}

describe("📃 README", () => {
  codeSnippets.forEach(({ label, code }, index) => {
    test(`${label} (Snippet #${index + 1})`, async () => {
      const transpiledCode = `
        async function main() {
          ${transpile(code)}
        }
        main();
      `;

      /* eslint-disable-next-line no-eval */
      await expect(eval(transpiledCode)).resolves.not.toThrow();
    });
  });
});
