module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**", "!<rootDir>/src/**/index.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  testMatch: ["**/*.spec.ts"],
  testEnvironment: "node",
  clearMocks: true,
  transform: {
    "^.+\\.(t|j)s$": ["@swc-node/jest"],
  },
};
