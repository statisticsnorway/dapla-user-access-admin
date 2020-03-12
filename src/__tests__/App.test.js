import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import App from '../App'
import { AppContextProvider } from '../utilities'
import { BACKEND_API } from '../configurations'
import { APP_SETTINGS, LANGUAGE, UI } from '../enums'

const language = LANGUAGE.LANGUAGES.ENGLISH.languageCode

const setup = () => {
  const { getByTestId, getByText } = render(
    <AppContextProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByTestId, getByText }
}

test('Does not crash', () => {
  useAxios.mockReturnValue([{ loading: true, error: null, response: null }])
  setup()

  expect(useAxios).toHaveBeenCalledWith(`${process.env.REACT_APP_API}${BACKEND_API.GET_HEALTH}`)
})

test('Renders basics', () => {
  useAxios.mockReturnValue([{ loading: false, error: null, response: null }])
  const { getByText } = setup()

  expect(getByText(UI.HEADER[language])).toBeInTheDocument()
})

test('Change language works correctly', () => {
  const otherLanguage = LANGUAGE.LANGUAGES.NORWEGIAN.languageCode
  useAxios.mockReturnValue([{ loading: false, error: null, response: null }])
  const { getByText } = setup()

  userEvent.click(getByText(LANGUAGE.NORWEGIAN[language]))

  expect(getByText(UI.HEADER[otherLanguage])).toBeInTheDocument()
})

test('Opens settings', () => {
  useAxios.mockReturnValue([{ loading: false, error: null, response: null }])
  const { getByTestId, getByText } = setup()

  userEvent.click(getByTestId('settingsCog'))

  expect(getByText(APP_SETTINGS.HEADER[language])).toBeInTheDocument()
})

test('Renders error when backend call returns error', () => {
  const stringError = 'A problem occured'
  useAxios.mockReturnValue([{ loading: false, error: stringError, response: null }])
  const { getByText } = setup()

  expect(getByText(stringError)).toBeInTheDocument()
})
