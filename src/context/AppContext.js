import React, { useState } from 'react'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

export const ApiContext = React.createContext({
  authApi: window.__ENV.REACT_APP_API_AUTH,
  catalogApi: window.__ENV.REACT_APP_API_CATALOG
})

export const LanguageContext = React.createContext(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

export const AppContextProvider = (props) => {
  const [authApi, setAuthApi] = useState(window.__ENV.REACT_APP_API_AUTH)
  const [catalogApi, setCatalogApi] = useState(window.__ENV.REACT_APP_API_CATALOG)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

  return (
    <ApiContext.Provider value={{ authApi, catalogApi, setAuthApi, setCatalogApi }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        {props.children}
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )
}
