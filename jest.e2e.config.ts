import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

export default {
  bail: 0,
  clearMocks: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: `<rootDir>/${compilerOptions.baseUrl}`,
  }),
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/_infra/http/**/controllers/__tests__/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tests.ts'],
}
