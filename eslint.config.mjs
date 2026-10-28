import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 퍼블리싱 CSS 가 img 크기를 직접 지정하고 있어 우선 <img> 를 그대로 쓴다.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", ".next.nosync/**", "node_modules/**", "next-env.d.ts"] },
];

export default eslintConfig;
