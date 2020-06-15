import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import App from '../App'
import { AppContextProvider } from '../utilities'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { LANGUAGE, SETTINGS, TEST_IDS, UI } from '../enums'

jest.mock('../components/AppHome', () => () => null)
jest.mock('../components/role/RolesTable', () => () => null)
jest.mock('../components/user/UsersTable', () => () => null)
jest.mock('../components/group/GroupsTable', () => () => null)
jest.mock('../components/catalog/CatalogsTable', () => () => null)

const { errorObject, language, otherLanguage } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByTestId, getByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByTestId, getByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ loading: false, error: null, response: null }])

  test('Does not crash', () => {
    const { getByText } = setup()

    expect(getByText(UI.HEADER[language])).toBeInTheDocument()
    expect(useAxios).toHaveBeenCalledWith(`${process.env.REACT_APP_API_AUTH}${API.GET_HEALTH}`)
    expect(useAxios).toHaveBeenCalledWith(`${process.env.REACT_APP_API_CATALOG}${API.GET_HEALTH}`)
  })

  test('Change language works correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(LANGUAGE.ENGLISH[language]))

    expect(getByText(UI.HEADER[otherLanguage])).toBeInTheDocument()
  })

  test('Opens settings', () => {
    const { getByTestId, getByText } = setup()

    userEvent.click(getByTestId(TEST_IDS.ACCESS_SETTINGS_BUTTON))

    expect(getByText(SETTINGS.HEADER[language])).toBeInTheDocument()
  })
})

test('Loads', () => {
  useAxios.mockReturnValue([{ loading: true, error: null, response: null }])
  setup()
})

test('Renders error when api call returns error', () => {
  useAxios.mockReturnValue([{ loading: false, error: errorObject, response: null }])
  const { getByText } = setup()

  expect(getByText(UI.API_ERROR_MESSAGE[language])).toBeInTheDocument()
})
