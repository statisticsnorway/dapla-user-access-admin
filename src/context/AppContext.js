import { createContext, useState } from 'react'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

export const ApiContext = createContext({
  advancedUser: false,
  simpleRoleView: true,
  authApi: window.__ENV.REACT_APP_API_AUTH,
  catalogApi: window.__ENV.REACT_APP_API_CATALOG
})

export const LanguageContext = createContext(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

export const AppContextProvider = (props) => {
  const [authApi, setAuthApi] = useState(window.__ENV.REACT_APP_API_AUTH)
  const [catalogApi, setCatalogApi] = useState(window.__ENV.REACT_APP_API_CATALOG)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)
  const [advancedUser, setAdvancedUser] = useState(
    localStorage.getItem('advancedUser') !== null ?
      localStorage.getItem('advancedUser') === 'true' : false
  )
  const [simpleRoleView, setSimpleRoleView] = useState(
    localStorage.getItem('simpleRoleView') !== null ?
      localStorage.getItem('simpleRoleView') === 'true' : false
  )

  return (
    <ApiContext.Provider
      value={{
        authApi,
        catalogApi,
        setAuthApi,
        setCatalogApi,
        advancedUser,
        setAdvancedUser,
        simpleRoleView,
        setSimpleRoleView
      }}
    >
      <LanguageContext.Provider value={{ language, setLanguage }}>
        {props.children}
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )
}
