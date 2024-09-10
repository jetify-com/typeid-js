import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  roots: ["<rootDir>/test"],
  transform: {
    "\\.[jt]s?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.json",
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(.pnpm|uuid))"],
  verbose: true,
};

export default config;
