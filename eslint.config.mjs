import prettier from "eslint-plugin-prettier"
import {defineConfig, globalIgnores} from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const esLintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      prettier,
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/require-await": "off",
      "no-console": ["error", {allow: ["warn", "error"]}],
      "no-fallthrough": "off",
      "no-restricted-syntax": [
        "error",
        {selector: "Literal[value=/text-m[\\d]/i]", message: "text-m# is outdated and not supported."},
      ],
      "no-restricted-imports": [
        "error",
        {
          name: "tailwind-merge",
          importNames: ["twMerge"],
          message: "Use custom tailwind merge plugin cn() from @lib/utils/className.",
        },
        {
          name: "clsx",
          importNames: ["clsx"],
          message: "Use custom tailwind merge plugin cn() from @lib/utils/className.",
        },
        {
          name: "cnb",
          importNames: ["cnbuilder"],
          message: "Use custom tailwind merge plugin cn() from @lib/utils/className.",
        },
      ],
      "prettier/prettier": ["error"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  globalIgnores(["**/__generated__/**/*", "src/styles/**/*"]),
])
export default esLintConfig
