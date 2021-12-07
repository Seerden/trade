/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ["node_modules", "src"],
    "transform": {
      "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!variables/.*)"
    ]
  };