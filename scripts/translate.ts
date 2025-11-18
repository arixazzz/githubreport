import fs from "fs";
import path from "path";
import { translate } from "@vitalets/google-translate-api";

const args = process.argv.slice(2);

const SOURCE_PATH = args[0] || "src/messages/id.json";
const TARGET_PATH = args[1] || "src/messages/en.json";
const FROM_LANG = args[2] || "id";
const TO_LANG = args[3] || "en";

async function translateText(text: string): Promise<string> {
  const result = await translate(text, { from: FROM_LANG, to: TO_LANG });
  return result.text;
}

async function translateObject(
  obj: Record<string, any>,
  existing: Record<string, any> = {}
): Promise<Record<string, any>> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      if (existing?.[key]) {
        result[key] = existing[key]; // ✅ Skip jika sudah ada
      } else if (value.trim() === "") {
        result[key] = ""; // ✅ biarkan kosong
      } else {
        const translated = await translateText(value);
        result[key] = translated;
        console.log(`🌍 "${value}" → "${translated}"`);
      }
    } else if (typeof value === "object" && value !== null) {
      result[key] = await translateObject(value, existing[key] || {});
    } else {
      result[key] = value;
    }
  }

  return result;
}

(async () => {
  console.log(`🌐 Translating from ${FROM_LANG} to ${TO_LANG}`);
  console.log(`📂 Source: ${SOURCE_PATH}`);
  console.log(`💾 Output: ${TARGET_PATH}`);

  const raw = fs.readFileSync(path.resolve(SOURCE_PATH), "utf-8");
  const sourceObj = JSON.parse(raw);

  let existingTarget = {};
  if (fs.existsSync(TARGET_PATH)) {
    existingTarget = JSON.parse(fs.readFileSync(TARGET_PATH, "utf-8"));
  }

  const translatedObj = await translateObject(sourceObj, existingTarget);

  fs.writeFileSync(TARGET_PATH, JSON.stringify(translatedObj, null, 2));
  console.log("✅ Translation complete!");
})();
