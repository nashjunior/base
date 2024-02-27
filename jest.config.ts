import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

export default {
  bail: 0,
  clearMocks: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: `<rootDir>/${compilerOptions.baseUrl}`,
  }),
  coverageProvider: 'v8',
  collectCoverageFrom: ['<rootDir>/src/_application/**/usecases/*.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/_application/**/*.spec.ts'],
  // transform: {
  //   '^.+\\.tsx?$': 'esbuild-jest',
  // },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tests.ts'],
}
