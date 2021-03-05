import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

const errorString = 'A problem occured'

export const TEST_CONFIGURATIONS = {
  alternativeTestGroupId: 'testGroupId2',
  alternativeTestGroupDescription: 'A new group description',
  alternativeTestRoleId: 'testRoleId2',
  alternativeTestRoleDescription: 'A new role description',
  alternativeTestUserId: 'testUserId2',
  alternativeUrl: 'http://localhost:9999',
  apiContext: (fn) => ({
    authApi: window.__ENV.REACT_APP_API_AUTH,
    catalogApi: window.__ENV.REACT_APP_API_CATALOG,
    setAuthApi: fn,
    setCatalogApi: fn
  }),
  errorString: errorString,
  errorObject: { response: { data: errorString } },
  language: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  otherLanguage: LANGUAGE.LANGUAGES.ENGLISH.languageCode,
  responseObject: { data: { statusCode: 200 } },
  testGroupId: 'testGroupId',
  testRoleId: 'testRoleId',
  testUserId: 'testUserId'
}
