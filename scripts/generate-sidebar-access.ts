import fs from "fs";
import path from "path";
import fg from "fast-glob";
import ts from "typescript";

const APP_PATH = path.join(process.cwd(), "src/app/(protected)");
const OUTPUT_PATH = path.join(process.cwd(), "middleware/sidebarAccessMap.ts");

function extractAccessExport(filePath: string): any | null {
  const source = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.ESNext,
    true
  );

  let accessObj: any = null;

  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const declaration = node.declarationList.declarations[0];
      if (
        declaration.name.getText() === "access" &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        const result: any = {};
        declaration.initializer.properties.forEach((prop) => {
          if (
            ts.isPropertyAssignment(prop) &&
            ts.isArrayLiteralExpression(prop.initializer)
          ) {
            const key = prop.name.getText();
            const values = prop.initializer.elements.map((e) =>
              e.getText().replace(/['"]/g, "")
            );
            result[key] = values;
          }
        });
        accessObj = result;
      }
    }
  });

  return accessObj;
}

function filePathToRoute(relativePath: string): string {
  const noExt = relativePath.replace(/\/page\.tsx?$/, "");

  const parts = noExt.split(path.sep).map((part) => {
    // Buang route group: (folder)
    if (/^\(.*\)$/.test(part)) return null;

    // Buang parallel slot: @slot
    if (part.startsWith("@")) return null;

    // Optional catch-all: [[...slug]] → :slug*
    if (part.startsWith("[[...") && part.endsWith("]]")) {
      return `:${part.slice(5, -2)}*`;
    }

    // Catch-all: [...slug] → :slug*
    if (part.startsWith("[...") && part.endsWith("]")) {
      return `:${part.slice(4, -1)}*`;
    }

    // Dynamic: [id] → :id
    if (part.startsWith("[") && part.endsWith("]")) {
      return `:${part.slice(1, -1)}`;
    }

    // Static
    return part;
  });

  // Filter null/empty
  let route = "/" + parts.filter(Boolean).join("/");

  // Bersihin double slash
  route = route.replace(/\/{2,}/g, "/");

  // Hapus trailing slash (kecuali root)
  if (route.length > 1) route = route.replace(/\/+$/, "");

  return route || "/";
}

function generateOutputFile(routeMap: Record<string, any>) {
  const entries = Object.entries(routeMap)
    .map(
      ([route, access]) =>
        `  "${route}": ${JSON.stringify(access, null, 2).replace(/\n/g, "\n  ")}`
    )
    .join(",\n");

  const content = `
  // 🚨 AUTO-GENERATED — DO NOT EDIT\nexport const sidebarAccessMap: SidebarAccessMap = {\n${entries}\n};\n`;

  fs.writeFileSync(OUTPUT_PATH, content, "utf-8");
  console.log(`✅ sidebarAccessMap.ts generated at: ${OUTPUT_PATH}`);
}

function main() {
  const files = fg.sync("**/page.tsx", { cwd: APP_PATH, absolute: true });

  const routeMap: Record<string, any> = {};

  for (const file of files) {
    const relative = path.relative(APP_PATH, file);
    const routePath = filePathToRoute(relative);
    const access = extractAccessExport(file);

    if (access) {
      // 🔹 Filter key yang kosong
      const cleanedAccess = Object.fromEntries(
        Object.entries(access).filter(([_, val]) => {
          // Array kosong [] atau [""] → buang
          if (Array.isArray(val)) {
            const normalized = val.map((v) => v.trim()).filter(Boolean);
            return normalized.length > 0;
          }
          return true; // kalau bukan array, tetap simpan
        })
      );

      // 🔹 Hanya assign kalau masih ada isi
      if (Object.keys(cleanedAccess).length > 0) {
        routeMap[routePath] = cleanedAccess;
      }
    }
  }

  generateOutputFile(routeMap);
}

main();
