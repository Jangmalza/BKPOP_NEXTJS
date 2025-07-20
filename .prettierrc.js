/**
 * Prettier 설정
 * @description 코드 포맷팅 규칙 설정
 */

module.exports = {
  // 기본 설정
  semi: true,                    // 세미콜론 사용
  trailingComma: 'es5',         // 후행 쉼표 (ES5 호환)
  singleQuote: true,            // 단일 따옴표 사용
  doubleQuote: false,           // 이중 따옴표 사용 안함
  
  // 들여쓰기 설정
  tabWidth: 2,                  // 탭 너비 2칸
  useTabs: false,               // 탭 대신 스페이스 사용
  
  // 줄 길이 설정
  printWidth: 100,              // 한 줄 최대 길이
  
  // 괄호 설정
  bracketSpacing: true,         // 객체 괄호 내부 공백
  bracketSameLine: false,       // 태그 닫는 괄호 다음 줄
  
  // 화살표 함수 설정
  arrowParens: 'avoid',         // 화살표 함수 괄호 (단일 매개변수시 생략)
  
  // 문자열 따옴표 설정
  quoteProps: 'as-needed',      // 객체 속성 따옴표 (필요시에만)
  
  // JSX 설정
  jsxSingleQuote: false,        // JSX에서 단일 따옴표 사용 안함
  jsxBracketSameLine: false,    // JSX 태그 닫는 괄호 다음 줄
  
  // 개행 설정
  endOfLine: 'lf',              // 개행 문자 (Unix)
  
  // 파일 종류별 설정
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'preserve',
      },
    },
    {
      files: '*.{css,scss,sass}',
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },
    {
      files: '*.{yml,yaml}',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
  
  // 파일 무시 설정
  ignore: [
    '**/*.min.js',
    '**/*.min.css',
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
  ],
} 