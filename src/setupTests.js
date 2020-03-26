import '@testing-library/jest-dom/extend-expect'

import { API } from '../src/configurations'
import { LANGUAGE } from '../src/enums'

jest.mock('axios-hooks')

export const TEST_CONFIGURATIONS = {
  alternativeTestRoleId: 'testRoleId2',
  alternativeTestUserId: 'testUserId2',
  alternativeUrl: 'http://localhost:9999',
  apiContext: {
    authApi: process.env.REACT_APP_API_AUTH,
    catalogApi: process.env.REACT_APP_API_CATALOG,
    setAuthApi: jest.fn(),
    setCatalogApi: jest.fn()
  },
  emptyRole: {
    data: {
      roleId: 'testUserId2',
      states: [],
      privileges: [],
      maxValuation: '',
      namespacePrefixes: []
    }
  },
  errorString: 'A problem occured',
  execute: jest.fn(),
  executePut: jest.fn(),
  language: LANGUAGE.LANGUAGES.ENGLISH.languageCode,
  objectString: '[object Object]',
  otherLanguage: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  refetch: jest.fn(),
  returnRoles: {
    roles: [
      {
        roleId: 'role1',
        states: ['RAW'],
        privileges: ['READ'],
        maxValuation: 'OPEN',
        namespacePrefixes: ['/test/1']
      }, {
        roleId: 'role2',
        states: ['RAW'],
        privileges: ['READ'],
        maxValuation: 'OPEN',
        namespacePrefixes: ['/test/2']
      }
    ]
  },
  testRole: {
    roleId: 'testRoleId',
    states: [API.ENUMS.STATES[1]],
    privileges: [API.ENUMS.PRIVILEGES[1]],
    maxValuation: API.ENUMS.VALUATIONS[1],
    namespacePrefixes: ['/test/1', '/test/2']
  },
  testRoles: ['role1', 'role2'],
  testRoleId: 'testRoleId'
}
