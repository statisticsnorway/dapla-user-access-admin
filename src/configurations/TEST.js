import { API } from './'
import { LANGUAGE } from '../enums'

export const TEST_CONFIGURATIONS = {
  alternativeTestRoleId: 'testRoleId2',
  alternativeTestUserId: 'testUserId2',
  alternativeUrl: 'http://localhost:9999',
  apiContext: { authApi: process.env.REACT_APP_API_AUTH, setAuthApi: jest.fn() },
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
  returnRoles: { roles: [{ roleId: 'role1' }, { roleId: 'role2' }] },
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
