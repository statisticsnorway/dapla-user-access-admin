import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AppSettings } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { LANGUAGE, SETTINGS } from '../enums'

const language = LANGUAGE.LANGUAGES.ENGLISH.languageCode
const api = { authApi: process.env.REACT_APP_API_AUTH, catalogApi: process.env.REACT_APP_API_CATALOG }
const apiContext = { ...api, setAuthApi: jest.fn(), setCatalogApi: jest.fn() }

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppSettings
          authError={null}
          catalogError={null}
          loading={false}
          open={true}
          setSettingsOpen={jest.fn()}
        />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

test('Renders correctly', () => {
  const { getByPlaceholderText } = setup()

  expect(getByPlaceholderText(SETTINGS.AUTH_API[language])).toHaveValue(apiContext.authApi)
})

test('Editing works correctly', () => {
  const editedAuthApi = 'http://localhost:2500'
  const editedCatalogApi = 'http://localhost:3500'
  const { getByPlaceholderText, getByText } = setup()

  userEvent.type(getByPlaceholderText(SETTINGS.AUTH_API[language]), editedAuthApi)
  userEvent.type(getByPlaceholderText(SETTINGS.CATALOG_API[language]), editedCatalogApi)

  expect(getByText(SETTINGS.EDITED_VALUES[language])).toBeInTheDocument()

  userEvent.click(getByText(SETTINGS.APPLY[language]))

  expect(apiContext.setAuthApi).toHaveBeenCalled()
  expect(apiContext.setCatalogApi).toHaveBeenCalled()
})

test('Resetting to default values works correctly', () => {
  const editedAuthApi = 'http://localhost:2500'
  const editedCatalogApi = 'http://localhost:3500'
  const { getByPlaceholderText, getByTestId } = setup()

  userEvent.type(getByPlaceholderText(SETTINGS.AUTH_API[language]), editedAuthApi)
  userEvent.type(getByPlaceholderText(SETTINGS.CATALOG_API[language]), editedCatalogApi)

  userEvent.click(getByTestId('setDefaultSettings'))

  // There is a bug in https://github.com/statisticsnorway/ssb-component-library preventing values from updating when updated from another source then itself
  //expect(getByPlaceholderText(SETTINGS.AUTH_API[language])).toHaveValue(api.authApi)
  //expect(getByPlaceholderText(SETTINGS.CATALOG_API[language])).toHaveValue(api.catalogApi)
  expect(apiContext.setAuthApi).toHaveBeenCalledWith(api.authApi)
  expect(apiContext.setCatalogApi).toHaveBeenCalledWith(api.catalogApi)
})
