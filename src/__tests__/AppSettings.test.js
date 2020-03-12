import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AppSettings } from '../components'
import { BackendContext, LanguageContext } from '../utilities'
import { APP_SETTINGS, LANGUAGE } from '../enums'

const language = LANGUAGE.LANGUAGES.ENGLISH.languageCode
const backend = process.env.REACT_APP_API
const backendContext = { backendUrl: backend, setBackendUrl: jest.fn() }

const setup = () => {
  const { getByPlaceholderText, getByText } = render(
    <BackendContext.Provider value={backendContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppSettings
          error={null}
          loading={false}
          open={true}
          setSettingsOpen={jest.fn()}
        />
      </LanguageContext.Provider>
    </BackendContext.Provider>
  )

  return { getByPlaceholderText, getByText }
}

test('Renders correctly', () => {
  const { getByPlaceholderText } = setup()

  expect(getByPlaceholderText(APP_SETTINGS.BACKEND_URL[language])).toHaveValue(backend)
})

test('Information appears', () => {
  const newBackend = 'http://localhost:2500'
  const { getByPlaceholderText, getByText } = setup()

  userEvent.type(getByPlaceholderText(APP_SETTINGS.BACKEND_URL[language]), newBackend)

  expect(getByText(APP_SETTINGS.EDITED_VALUES[language])).toBeInTheDocument()

  userEvent.click(getByText(APP_SETTINGS.APPLY[language]))

  expect(backendContext.setBackendUrl).toHaveBeenCalled()
})
