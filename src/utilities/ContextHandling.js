import React, { useState } from 'react'

import { LANGUAGE } from '../enums'

export const BackendContext = React.createContext({
  defaultBackendUrl: process.env.REACT_APP_API
})
export const LanguageContext = React.createContext(LANGUAGE.LANGUAGES.ENGLISH.languageCode)

export const AppContextProvider = (props) => {
  const [backendUrl, setBackendUrl] = useState(process.env.REACT_APP_API)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.ENGLISH.languageCode)

  return (
    <BackendContext.Provider value={{
      backendUrl,
      setBackendUrl
    }}>
      <LanguageContext.Provider value={{
        language,
        setLanguage
      }}>
        {props.children}
      </LanguageContext.Provider>
    </BackendContext.Provider>
  )
}
