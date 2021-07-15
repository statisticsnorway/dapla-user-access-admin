import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

export const TEST_CONFIGURATIONS = {
  alternativeApi: 'http://localhost:9999',
  apiContext: (fn1, fn2, fn3, fn4) => ({
    authApi: window.__ENV.REACT_APP_API_AUTH,
    catalogApi: window.__ENV.REACT_APP_API_CATALOG,
    setAuthApi: fn1,
    setCatalogApi: fn2,
    advancedUser: false,
    setAdvancedUser: fn3,
    simpleRoleView: false,
    setSimpleRoleView: fn4
  }),
  errorString: 'A problem occurred',
  language: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  otherLanguage: LANGUAGE.LANGUAGES.ENGLISH.languageCode,
  responseObject: { data: { statusCode: 200 } },
  errorObject: { response: { statusText: 'Error' } },
  errorResponse: { response: { data: 'Error', status: 500, statusText: 'Error' } }
}
