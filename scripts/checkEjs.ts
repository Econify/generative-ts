import fs from "fs/promises";
import path from "path";
import ejs from "ejs";

// currently unused, will be used if ever move ejs templates into standalone .ejs files

const PACKAGES = path.join(__dirname, "../packages");

const validateEJS = async (dir: string): Promise<boolean> => {
  const files = await fs.readdir(dir);

  const results = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        return validateEJS(filePath);
      }
      if (path.extname(file) === ".ejs") {
        const content = await fs.readFile(filePath, "utf-8");
        try {
          ejs.compile(content, { filename: filePath });
          console.log(`✅ ${path.relative(PACKAGES, filePath)}`);
          return true;
        } catch (e) {
          console.log(`❌ ${path.relative(PACKAGES, filePath)}`);
          console.error((e as Error).message);
          return false;
        }
      }
      return true;
    }),
  );

  return results.every((result) => result);
};

async function main() {
  try {
    const isValid = await validateEJS(PACKAGES);
    if (!isValid) {
      console.error("\n❌ Some .ejs files are invalid");
      process.exit(1);
    }
  } catch (e) {
    console.error("\n❌ Caught an error while validating .ejs files");
    console.error(e);
    process.exit(1);
  }

  console.log("\n🎉 All .ejs files are valid");
}

// eslint-disable-next-line no-void
void main();
