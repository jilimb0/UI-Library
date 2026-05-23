import typescript from '@rollup/plugin-typescript';

const onwarn = (warning, warn) => {
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
  if (warning.code === 'UNRESOLVED_IMPORT') return;
  warn(warning);
};

export default {
  input: 'src/index.ts',
  onwarn,
  output: [
    { file: 'dist/index.js', format: 'cjs', sourcemap: false },
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: false },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      outputToFilesystem: true,
      sourceMap: false,
      inlineSources: false,
    }),
  ],
};
