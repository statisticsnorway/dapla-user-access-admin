import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'

import { AppHome } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { LANGUAGE, TEST_IDS, UI } from '../enums'

const refetch = jest.fn()
const language = LANGUAGE.LANGUAGES.ENGLISH.languageCode
const api = { authApi: process.env.REACT_APP_API_AUTH, catalogApi: process.env.REACT_APP_API_CATALOG }
const apiContext = { ...api, setAuthApi: jest.fn(), setCatalogApi: jest.fn() }

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppHome />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

test('Renders correctly', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: null }, refetch])
  const { getByPlaceholderText, getByText } = setup()

  expect(getByText(UI.USER[language])).toBeInTheDocument()
  expect(getByPlaceholderText(UI.USER[language])).toHaveValue('user1')
})

test('Changing user works correctly', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: null }, refetch])
  const { getByPlaceholderText, getByTestId } = setup()

  userEvent.type(getByPlaceholderText(UI.USER[language]), 'test')
  userEvent.click(getByTestId(TEST_IDS.REFRESH_USER))

  expect(refetch).toHaveBeenCalled()
})
