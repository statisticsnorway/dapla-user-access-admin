import React, { useState } from 'react'

import { LANGUAGE } from '../enums'

export const ApiContext = React.createContext({ authApi: process.env.REACT_APP_API_AUTH })

export const LanguageContext = React.createContext(LANGUAGE.LANGUAGES.ENGLISH.languageCode)

export const AppContextProvider = (props) => {
  const [authApi, setAuthApi] = useState(process.env.REACT_APP_API_AUTH)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.ENGLISH.languageCode)

  return (
    <ApiContext.Provider value={{ authApi, setAuthApi }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        {props.children}
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )
}
