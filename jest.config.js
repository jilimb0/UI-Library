module.exports = {
  projects: ["<rootDir>/packages/*", "<rootDir>/apps/*"],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "json", "html"],
  collectCoverageFrom: [
    "packages/*/src/**/*.{ts,tsx}",
    "apps/*/src/**/*.{ts,tsx}",
    "!**/*.stories.{ts,tsx}",
    "!**/test/**",
    "!**/__tests__/**",
  ],
}
