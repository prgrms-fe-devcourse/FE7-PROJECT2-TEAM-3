/** @type {import("prettier").Config} */
module.exports = {
  // 기본 스타일
  semi: true, // 세미콜론 붙임
  singleQuote: false, // 따옴표: 쌍따옴표
  trailingComma: "es5", // 가능하면 끝에 , 붙임
  tabWidth: 2, // 들여쓰기 2칸
  useTabs: false,

  // JSX / TSX
  jsxSingleQuote: false, // JSX에서는 항상 쌍따옴표
  bracketSpacing: true, // { foo: bar }에 공백 허용
  bracketSameLine: false, // JSX 마지막 > 줄바꿈

  // Tailwind 플러그인 옵션
  plugins: [require("prettier-plugin-tailwindcss")],

  // TailwindCSS 정렬 방식
  tailwindConfig: "./tailwind.config.js",
  tailwindFunctions: ["clsx", "cva", "twMerge"],

  // 최대 줄 길이
  printWidth: 100,
};
