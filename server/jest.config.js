// module.exports = {
//   testEnvironment: 'node',
//   transform: {
//     "^.+\\.tsx?$": "ts-jest"
//   },
//   moduleFileExtensions: [
//     "ts",
//     "d.ts",
//     "tsx",
//     "js",
//     "jsx",
//     "json",
//     "node"
//   ],
//   testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
//   coverageDirectory: 'coverage',
//   collectCoverageFrom: [
//     'src/**/*.{ts,tsx,js,jsx}',
//     '!src/**/*.d.ts',
//   ],
// };
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true
  // collectCoverageFrom: ['src/**/*.{js,ts}'],
};
