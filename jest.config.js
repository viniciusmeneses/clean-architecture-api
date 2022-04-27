module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  testMatch: ["**/*.spec.ts"],
  testEnvironment: "node",
  clearMocks: true,
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleNameMapper: {
    "@domain/(.*)": "<rootDir>/src/domain/$1",
    "@infra/(.*)": "<rootDir>/src/infra/$1",
    "@main/(.*)": "<rootDir>/src/main/$1",
    "@presentation/(.*)": "<rootDir>/src/presentation/$1",
    "@tests/(.*)": "<rootDir>/tests/$1",
  },
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest"],
  },
};
