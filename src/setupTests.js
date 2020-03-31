import '@testing-library/jest-dom/extend-expect'

import { AUTH_API, CATALOG_API } from '../src/configurations'
import { LANGUAGE } from '../src/enums'

jest.mock('axios-hooks')

export const TEST_CONFIGURATIONS = {
  alternativeTestGroupId: 'testGroupId2',
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
      [AUTH_API.ROLE_OBJECT.ENUM]: '',
      [AUTH_API.ROLE_OBJECT.ARRAY[1]]: [],
      [AUTH_API.ROLE_OBJECT.ARRAY[0]]: [],
      [AUTH_API.ROLE_OBJECT.STRING[1]]: '',
      [AUTH_API.ROLE_OBJECT.STRING[0]]: '',
      [AUTH_API.ROLE_OBJECT.LIST]: { [AUTH_API.INCLUDES]: [] }
    }
  },
  emptyCatalogs: { [CATALOG_API.CATALOGS]: [] },
  errorHeader: 'Error header',
  errorString: 'A problem occured',
  errorObject: { response: { data: 'A problem occured' } },
  execute: jest.fn(),
  executePut: jest.fn(),
  language: LANGUAGE.LANGUAGES.ENGLISH.languageCode,
  objectString: '[object Object]',
  otherLanguage: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  refetch: jest.fn(),
  responseObject: { data: { statusCode: 200 } },
  returnCatalogs: {
    [CATALOG_API.CATALOGS]: [
      {
        id: {
          path: '/test/1'
        }
      }
    ]
  },
  returnGroups: {
    [AUTH_API.GROUPS]: [
      {
        [AUTH_API.GROUP_OBJECT.LIST]: ['role1'],
        [AUTH_API.GROUP_OBJECT.STRING[0]]: 'group1',
        [AUTH_API.GROUP_OBJECT.STRING[1]]: 'A group'
      },
      {
        [AUTH_API.GROUP_OBJECT.LIST]: ['role2'],
        [AUTH_API.GROUP_OBJECT.STRING[0]]: 'group2',
        [AUTH_API.GROUP_OBJECT.STRING[1]]: 'An alternative group'
      }
    ]
  },
  returnRoles: {
    [AUTH_API.ROLES]: [
      {
        [AUTH_API.ROLE_OBJECT.STRING[0]]: 'role1',
        [AUTH_API.ROLE_OBJECT.STRING[1]]: 'A role',
        [AUTH_API.ROLE_OBJECT.ENUM]: AUTH_API.ENUMS.VALUATIONS[0],
        [AUTH_API.ROLE_OBJECT.ARRAY[1]]: [AUTH_API.ENUMS.STATES[0]],
        [AUTH_API.ROLE_OBJECT.ARRAY[0]]: [AUTH_API.ENUMS.PRIVILEGES[0]],
        [AUTH_API.ROLE_OBJECT.LIST]: { [AUTH_API.INCLUDES]: ['/test/1'] }
      }, {
        [AUTH_API.ROLE_OBJECT.STRING[0]]: 'role2',
        [AUTH_API.ROLE_OBJECT.STRING[1]]: 'Another role',
        [AUTH_API.ROLE_OBJECT.ENUM]: AUTH_API.ENUMS.VALUATIONS[1],
        [AUTH_API.ROLE_OBJECT.ARRAY[1]]: [AUTH_API.ENUMS.STATES[1]],
        [AUTH_API.ROLE_OBJECT.ARRAY[0]]: [AUTH_API.ENUMS.PRIVILEGES[1]],
        [AUTH_API.ROLE_OBJECT.LIST]: { [AUTH_API.INCLUDES]: ['/test/2'] }
      }
    ]
  },
  returnUser: {
    [AUTH_API.USER_OBJECT.STRING]: 'user1',
    [AUTH_API.USER_OBJECT.ARRAY[1]]: ['role1', 'role2'],
    [AUTH_API.USER_OBJECT.ARRAY[0]]: ['group1', 'group2']
  },
  testGroup: {
    [AUTH_API.GROUP_OBJECT.LIST]: ['role1', 'role2'],
    [AUTH_API.GROUP_OBJECT.STRING[0]]: 'testGroupId',
    [AUTH_API.GROUP_OBJECT.STRING[1]]: 'A test group'
  },
  testGroupId: 'testGroupId',
  testRole: {
    [AUTH_API.ROLE_OBJECT.STRING[0]]: 'testRoleId',
    [AUTH_API.ROLE_OBJECT.STRING[1]]: 'A test role',
    [AUTH_API.ROLE_OBJECT.ENUM]: AUTH_API.ENUMS.VALUATIONS[1],
    [AUTH_API.ROLE_OBJECT.ARRAY[1]]: [AUTH_API.ENUMS.STATES[1]],
    [AUTH_API.ROLE_OBJECT.ARRAY[1]]: [AUTH_API.ENUMS.PRIVILEGES[1]],
    [AUTH_API.ROLE_OBJECT.LIST]: { [AUTH_API.INCLUDES]: ['/test/1', '/test/2'] }
  },
  testRoleId: 'testRoleId',
  testUser: {
    [AUTH_API.USER_OBJECT.STRING]: 'testUserId',
    [AUTH_API.USER_OBJECT.ARRAY[1]]: ['role1', 'role2'],
    [AUTH_API.USER_OBJECT.ARRAY[0]]: ['group1', 'group2']
  },
  testUserId: 'testUserId',
  updatedTestGroup: {
    data: {
      [AUTH_API.GROUP_OBJECT.LIST]: ['role1'],
      [AUTH_API.GROUP_OBJECT.STRING[0]]: 'testGroupId2',
      [AUTH_API.GROUP_OBJECT.STRING[1]]: 'A test group described'
    }
  },
  updatedTestRole: {
    data: {
      [AUTH_API.ROLE_OBJECT.STRING[0]]: 'testRoleId2',
      [AUTH_API.ROLE_OBJECT.STRING[1]]: 'A test role described',
      [AUTH_API.ROLE_OBJECT.ENUM]: AUTH_API.ENUMS.VALUATIONS[2],
      [AUTH_API.ROLE_OBJECT.ARRAY[1]]: [AUTH_API.ENUMS.STATES[2]],
      [AUTH_API.ROLE_OBJECT.ARRAY[0]]: [AUTH_API.ENUMS.PRIVILEGES[2]],
      [AUTH_API.ROLE_OBJECT.LIST]: { [AUTH_API.INCLUDES]: ['/test/3'] }
    }
  },
  updatedTestUser: {
    data: {
      [AUTH_API.USER_OBJECT.ARRAY[1]]: ['role1'],
      [AUTH_API.USER_OBJECT.ARRAY[0]]: ['group1'],
      [AUTH_API.USER_OBJECT.STRING]: 'testUserId2'
    }
  }
}
