// scripts/generateProtectedRoutes.ts
import fg from "fast-glob";
import path from "path";
import fs from "fs";
import ts from "typescript";

const BASE = path.join(process.cwd(), "src/app/(protected)");

/** Cari semua file page|route (tsx|ts) */
const files = fg.sync("**/(page|route).ts*", { cwd: BASE, absolute: true });

/** Cek apakah segmen adalah route group: /(something) atau /(.)intercept */
const isRouteGroup = (seg: string) => /^\(.*\)$/.test(seg);

/** Cek apakah segmen adalah parallel route slot: /@slot */
const isParallelSlot = (seg: string) => seg.startsWith("@");

/** Konversi segmen Next App Router → pattern path-to-regexp friendly */
function mapSegmentToToken(segment: string): string | null {
  if (!segment || segment === "page" || segment === "route") return null;

  if (isRouteGroup(segment) || isParallelSlot(segment)) return null;

  const optionalCatch = /^\[\[\.\.\.(.+)\]\]$/.exec(segment);
  if (optionalCatch) return `:${optionalCatch[1]}*`;

  const catchAll = /^\[\.\.\.(.+)\]$/.exec(segment);
  if (catchAll) return `:${catchAll[1]}*`;

  const dyn = /^\[(.+)\]$/.exec(segment);
  if (dyn) return `:${dyn[1]}`;

  return segment;
}

function fileToRoutePattern(file: string): string {
  const withoutFile = file.replace(/\/(page|route)\.tsx?$/, "");
  const parts = withoutFile.split(path.sep);
  const mapped = parts.map(mapSegmentToToken).filter(Boolean) as string[];

  let route = "/" + mapped.join("/");
  route = route.replace(/\/{2,}/g, "/");
  if (route.length > 1) route = route.replace(/\/+$/, "");
  return route || "/";
}

/** Baca export access */
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
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const decl = node.declarationList.declarations[0];
      if (
        decl.name.getText() === "access" &&
        decl.initializer &&
        ts.isObjectLiteralExpression(decl.initializer)
      ) {
        const result: any = {};
        decl.initializer.properties.forEach((prop) => {
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

/** Filter biar access kosong/[""] nggak ikut */
function isAccessValid(access: any): boolean {
  if (!access) return false;

  const filtered = Object.entries(access).filter(([_, val]) => {
    if (Array.isArray(val)) {
      const normalized = val.map((v) => v.trim()).filter(Boolean);
      return normalized.length > 0;
    }
    return true;
  });

  return filtered.length > 0;
}

/** Generate patterns */
const routePatterns: string[] = [];

for (const file of files) {
  const routePath = fileToRoutePattern(path.relative(BASE, file));
  const access = extractAccessExport(file);

  if (isAccessValid(access)) {
    routePatterns.push(routePath);
  }
}

const uniqueSorted = Array.from(new Set(routePatterns)).sort((a, b) => {
  if (a.length !== b.length) return a.length - b.length;
  return a.localeCompare(b);
});

const outputPath = path.join(
  process.cwd(),
  "middleware",
  "generatedProtectedRoutes.ts"
);

const content =
  `// 🚨 GENERATED FILE. DO NOT EDIT MANUALLY\n` +
  `// Dibuat otomatis oleh scripts/generateProtectedRoutes.ts\n` +
  `export const protectedRoutes = ${JSON.stringify(uniqueSorted, null, 2)} as const;\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content);
console.log("✅ Generated protectedRoutes:", outputPath);
