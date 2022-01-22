const rollup = require("rollup");
const { babel } = require("@rollup/plugin-babel");
const eslint = require("@rollup/plugin-eslint");
const uglify = require("uglify-js");
const gzipSize = require("gzip-size");
const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const ENV_RE = /process\.env\.ASSMA_ENV/g;

async function build(package) {
  const pkg = require(`../packages/${package}/package.json`);

  const comment = `/**
 * ${pkg.displayName} v${pkg.version}
 * Copyright 2019-2022 Sayf Essyd
 * Released under the MIT License
 * https://www.assmajs.com
 */\r\n`;

  try {
    const bundle = await rollup.rollup({
      input: path.join(cwd, `/packages/${package}/index.js`),
      plugins: [
        eslint(),
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        })
      ]
    });

    let { output } = await bundle.generate({ format: "iife", name: pkg.displayName.replace(/\s/g, '') });
    let code = output[0].code;
    code = fs.readFileSync(path.join(cwd, "/scripts/template/wrapper")).toString().replace("MODULE_NAME", pkg.displayName.replace(/\s/g, '')).replace("ROLLUP_GENERATED_CODE", code.split("\n").slice(1, -3).join("\n")).replace("'use strict'", "\"use strict\"");

    const developmentCode = comment + code.replace(ENV_RE, '"development"');
    const productionCode = comment + uglify.minify(code.replace(ENV_RE, '"production"')).code;

    fs.writeFileSync(path.join(cwd, `/packages/${package}/dist/${package}.js`), developmentCode);
    fs.writeFileSync(path.join(cwd, `/packages/${package}/dist/${package}.min.js`), productionCode);

    console.log("Assma development -> " + developmentCode.length / 1000 + "kb");
    console.log("Assma production -> " + productionCode.length / 1000 + "kb");
    console.log("");
    console.log("Assma development (gzipped) -> " + gzipSize.sync(developmentCode) / 1000 + "kb");
    console.log("Assma production (gzipped) -> " + gzipSize.sync(productionCode) / 1000 + "kb");
  } catch (error) {
    console.error(error);
  }
}

const packages = fs.readdirSync(path.join(cwd, "/packages"));
for (let i = 0; i < packages.length; i++) {
  if (packages[i] == "compiler") {
    build(packages[i]);
  }
}
