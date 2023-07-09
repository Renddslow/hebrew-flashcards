import { build } from "esbuild";
import fs from 'fs';

const srcFiles = fs.readdirSync('./src');

build({
    entryPoints: srcFiles.map((p) => `src/${p}`),
    bundle: true,
    outdir: "public",
    minify: true,
    sourcemap: false,
    target: "es2015",
});