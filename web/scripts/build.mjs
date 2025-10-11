import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { build } from "esbuild";

rmSync("dist", { recursive: true, force: true });
execSync("tsc -p tsconfig.json", { stdio: "inherit" });

await build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  format: "esm",
  target: ["es2022"],
  outfile: "dist/index.js",
  sourcemap: true,
  minify: false,
  platform: "browser"
});
