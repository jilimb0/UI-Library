
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ 
      browser: true,
      preferBuiltins: false 
    }),
    commonjs(),
    postcss({
      extract: 'styles.css',
      minimize: true,
      sourceMap: true,
    }),
    typescript({ 
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types',
      sourceMap: true,
      exclude: ['**/*.test.*', '**/*.stories.*']
    }),
    terser({
      compress: {
        drop_console: true,
      },
    }),
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
};
