import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    semi: ["error", "always"],
    "react-hooks/set-state-in-effect": "off",
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts",
    "tailwind.config.ts", "components/ui/**/*"]
}];

export default eslintConfig;
