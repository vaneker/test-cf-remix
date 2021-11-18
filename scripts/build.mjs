import * as esbuild from 'esbuild';

async function build() {
  const mode = process.env.NODE_ENV?.toLowerCase() ?? 'development';

  console.log(`Building Worker in ${mode} mode`);

  const outfile = 'worker.js';
  const startTime = Date.now();
  const result = await esbuild.build({
    entryPoints: ['./worker/index.ts'],
    bundle: true,
    minify: mode === 'production',
    sourcemap: mode !== 'production',
    format: 'esm',
    metafile: true,
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
    },
    outfile,
  });
  const endTime = Date.now();

  console.log(`Built in ${endTime - startTime}ms`);

  if (mode === 'production') {
    console.log(await esbuild.analyzeMetafile(result.metafile));
  }
}

build().catch((e) => console.error('Unknown error caught during build:', e));
