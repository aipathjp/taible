import { defineConfig } from 'vitest/config';

// DOM-dependent packages run under happy-dom; everything else under node.
// (Vitest 4 removed `environmentMatchGlobs`, so the split is expressed as projects.)
const domPackages = ['packages/react', 'packages/io'];
const testFiles = (root: string): string[] => [
  `${root}/src/**/*.test.ts`,
  `${root}/src/**/*.test.tsx`,
];

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: testFiles('packages/*'),
          exclude: domPackages.flatMap(testFiles),
        },
      },
      {
        extends: true,
        test: {
          name: 'happy-dom',
          environment: 'happy-dom',
          include: domPackages.flatMap(testFiles),
        },
      },
    ],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/index.ts',
        '**/*.d.ts',
        '**/test-helpers.ts',
        '**/test-utils.ts',
        'packages/*/src/**/types.ts',
        // Type-only modules (interfaces / type aliases, no executable code).
        'packages/formula/src/ast.ts',
        'packages/formula/src/tokens.ts',
      ],
      thresholds: {
        lines: 100,
        statements: 100,
        branches: 100,
        functions: 100,
      },
    },
  },
});
