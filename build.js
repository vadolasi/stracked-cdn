import esbuild from "esbuild";
import { minify } from "terser";
import { writeFile } from "fs/promises";

const checkABTestsAndTrackingUrl = process.env.CHECK_AB_TESTS_AND_TRACKING_URL ?? "https://app.stracked.com.br/api/check-ab-test-and-tracking";
const trackingUrl = process.env.TRACKING_URL ?? "wss://tracking.stracked.com.br";

async function build() {
  const result = await esbuild.build({
    entryPoints: ["loader.ts"],
    bundle: true,
    minify: true,
    target: "es2020",
    treeShaking: true,
    format: "esm",
    platform: "browser",
    write: false,
    define: {
      "process.env.CHECK_AB_TESTS_AND_TRACKING_URL": `"${checkABTestsAndTrackingUrl}"`,
      "process.env.TRACKING_URL": `"${trackingUrl}"`,
    },
  });

  /*
  const minified = await minify(result.outputFiles[0].text, {
    mangle: {
      properties: {
        builtins: true,
        reserved: ["constructor"],
      },
    },
    compress: {
      passes: 4,
      pure_funcs: ["Error"],
      booleans_as_integers: true,
      arguments: true,
      drop_console: true,
      hoist_funs: true,
      unsafe: true,
    },
    ecma: 2020,
    toplevel: true,
    module: true,
  });
  */

  await writeFile("loader.js", result.outputFiles[0].text);
}

build();
