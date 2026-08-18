import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    server: "src/server.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  // No code splitting: a shared chunk (chunk-*.mjs) is gitignored via `dist/`
  // and would be missing from the #main tarball, breaking every consumer build.
  splitting: false,
  external: ["next"],
});
