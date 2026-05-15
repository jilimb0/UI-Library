import typescript from '@rollup/plugin-typescript';
export default {
  input: 'src/index.tsx',
  output: [
    { file: 'dist/index.js', format: 'cjs', sourcemap: true },
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
  external: ['react', '@tanstack/react-query', '@ui-lib/core'],
};
