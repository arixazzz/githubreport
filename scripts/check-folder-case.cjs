const { readdirSync, existsSync } = require("fs");
const { join, extname } = require("path");

const BASE_DIRS = ["./src/components"].filter(existsSync);
const kebabCaseRegex = /^[a-z0-9\-]+$/;
const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
const IGNORE_FOLDERS = ["ui"];
const ALLOWED_FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

let warnings = [];

function isCamelCase(filename) {
  const baseName = filename.replace(/\.[^/.]+$/, ""); // remove extension
  return camelCaseRegex.test(baseName);
}

function checkStructure(path) {
  const entries = readdirSync(path, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(path, entry.name);

    if (entry.isDirectory()) {
      if (
        !kebabCaseRegex.test(entry.name) &&
        !IGNORE_FOLDERS.includes(entry.name)
      ) {
        warnings.push(`❌ Folder "${fullPath}" harus pakai kebab-case`);
      }

      if (!IGNORE_FOLDERS.includes(entry.name)) {
        checkStructure(fullPath);
      }
    } else {
      const ext = extname(entry.name);
      const isDefinition = entry.name.endsWith(".d.ts");
      const isTest = entry.name.includes(".test.");

      if (
        ALLOWED_FILE_EXTENSIONS.includes(ext) &&
        !isTest &&
        !isDefinition &&
        !isCamelCase(entry.name)
      ) {
        warnings.push(`❌ File "${fullPath}" harus pakai camelCase`);
      }

      const nameWithoutExt = entry.name.replace(/\.(ts|tsx)$/, "");
      const hasReservedWord =
        /(^|[-_.])(type|types|interface|interfaces)([-_.]|$)/.test(
          nameWithoutExt
        );

      if (hasReservedWord && !isDefinition) {
        warnings.push(
          `❌ File "${fullPath}" mengandung "type/interface" tapi bukan .d.ts`
        );
      }
    }
  }
}

for (const dir of BASE_DIRS) {
  checkStructure(dir);
}

if (warnings.length > 0) {
  console.log("\n🚨 Struktur tidak valid ditemukan:\n");
  warnings.forEach((warn) => console.warn(warn));
  process.exit(1);
} else {
  console.log("✅ Semua folder dan file sudah sesuai konvensi");
}
