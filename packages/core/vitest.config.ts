export default {
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    server: {
      deps: {
        inline: ['jest-axe'],
      },
    },
    deps: {
      interopDefault: true,
    },
  },
};
