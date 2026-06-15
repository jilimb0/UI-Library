export {};

const port = process.env.PORT ?? '4173';
const _BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;
