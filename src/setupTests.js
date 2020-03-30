import '@testing-library/jest-dom/extend-expect'

import { API } from '../src/configurations'
import { LANGUAGE } from '../src/enums'

jest.mock('axios-hooks')

// TODO: Clean this up (put same values in consts outside and maybe remove stuff from here that only has 1 usage)
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
      roleId: 'testRoleId2',
      states: [],
      privileges: [],
      maxValuation: '',
      namespacePrefixes: []
    }
  },
  emptyCatalogs: { [API.CATALOGS]: [] },
  errorString: 'A problem occured',
  execute: jest.fn(),
  executePut: jest.fn(),
  language: LANGUAGE.LANGUAGES.ENGLISH.languageCode,
  objectString: '[object Object]',
  otherLanguage: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  refetch: jest.fn(),
  returnCatalogs: {
    [API.CATALOGS]: [
      {
        id: {
          path: '/test/1'
        }
      }
    ]
  },
  returnRoles: {
    [API.ROLES]: [
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
  returnUser: {
    roles: ['role1', 'role2'],
    userId: 'user1'
  },
  testRole: {
    roleId: 'testRoleId',
    states: [API.ENUMS.STATES[1]],
    privileges: [API.ENUMS.PRIVILEGES[1]],
    maxValuation: API.ENUMS.VALUATIONS[1],
    namespacePrefixes: ['/test/1', '/test/2']
  },
  testRoles: ['role1', 'role2'],
  testRoleId: 'testRoleId',
  testUserId: 'testUserId',
  updatedTestRole: {
    data: {
      roleId: 'testRoleId',
      states: [API.ENUMS.STATES[1], API.ENUMS.STATES[2]],
      privileges: [API.ENUMS.PRIVILEGES[1], API.ENUMS.PRIVILEGES[2]],
      maxValuation: API.ENUMS.VALUATIONS[2],
      namespacePrefixes: ['/test/1', '/test/2', '/test/3']
    }
  },
  updatedTestUser: {
    data: {
      userId: 'testUserId2',
      roles: ['role1']
    }
  }
}
