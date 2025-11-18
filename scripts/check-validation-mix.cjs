#!/usr/bin/env node
const { readdirSync, statSync, readFileSync } = require("fs");
const { join, extname } = require("path");

const BASE_DIRS = ["src/components", "src/app"];
const IGNORE_FOLDERS = ["ui"];
const ALLOWED_FILENAME = "validation.ts";

let violations = [];

function scanDir(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_FOLDERS.includes(entry.name)) {
        scanDir(fullPath);
      }
    } else {
      const ext = extname(entry.name);
      const isTSX = ext === ".tsx";
      const isValidationFile = entry.name === ALLOWED_FILENAME;

      if (isTSX || isValidationFile) {
        const content = readFileSync(fullPath, "utf8");
        const hasZodObject = content.includes("z.object");
        const hasZodInfer = content.includes("z.infer");

        // ❌ Kalau file .tsx mengandung salah satu dari z.object atau z.infer, itu pelanggaran
        if ((hasZodObject || hasZodInfer) && isTSX) {
          violations.push(
            `❌ File "${fullPath}" mengandung z.object atau z.infer dalam .tsx`
          );
        }
      }
    }
  }
}

for (const dir of BASE_DIRS) {
  scanDir(dir);
}

if (violations.length > 0) {
  console.log("\n🚨 Pelanggaran aturan zod ditemukan di file TSX:\n");
  violations.forEach((v) => console.warn(v));
  process.exit(1);
} else {
  console.log("✅ Tidak ada pelanggaran zod dalam file TSX.");
}
