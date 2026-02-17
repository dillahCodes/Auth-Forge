import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  {
    rules: {
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
]);

export default eslintConfig;
