import typescript from '@rollup/plugin-typescript';

const onwarn = (warning, warn) => {
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
  if (warning.code === 'UNRESOLVED_IMPORT') return;
  warn(warning);
};

export default {
  input: 'src/index.ts',
  onwarn,
  external: ['react'],
  output: [
    { file: 'dist/index.js', format: 'cjs', sourcemap: true },
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
  ],
  plugins: [
    typescript({ tsconfig: './tsconfig.json', outputToFilesystem: true }),
  ],
};
