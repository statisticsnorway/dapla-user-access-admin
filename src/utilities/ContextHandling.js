import React, { useState } from 'react'

import { LANGUAGE } from '../enums'

export const ApiContext = React.createContext({
  authApi: process.env.REACT_APP_API_AUTH,
  catalogApi: process.env.REACT_APP_API_CATALOG
})

export const LanguageContext = React.createContext(LANGUAGE.LANGUAGES.ENGLISH.languageCode)

export const AppContextProvider = (props) => {
  const [authApi, setAuthApi] = useState(process.env.REACT_APP_API_AUTH)
  const [catalogApi, setCatalogApi] = useState(process.env.REACT_APP_API_CATALOG)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.ENGLISH.languageCode)

  return (
    <ApiContext.Provider value={{
      authApi,
      setAuthApi,
      catalogApi,
      setCatalogApi
    }}>
      <LanguageContext.Provider value={{
        language,
        setLanguage
      }}>
        {props.children}
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )
}