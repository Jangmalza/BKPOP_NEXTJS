import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript 규칙 완화
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      
      // React 훅 규칙 완화
      "react-hooks/exhaustive-deps": "warn",
      
      // Next.js 최적화 권장사항을 경고로 변경
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      
      // 개발 중 유연성을 위한 규칙 완화
      "prefer-const": "warn",
      "no-console": "off",
      
      // Import 관련 규칙
      "import/no-unused-modules": "off",
    },
  },
];

export default eslintConfig;
