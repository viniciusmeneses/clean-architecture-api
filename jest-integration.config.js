// eslint-disable-next-line
const config = require("./jest.config");

config.testMatch = ["**/*.test.ts"];
config.setupFilesAfterEnv = [...config.setupFilesAfterEnv, "./jest-integration.setup.ts"];
module.exports = config;
