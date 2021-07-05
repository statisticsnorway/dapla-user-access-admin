import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { AppHome } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { DATASET_STATE, PRIVILEGE, TEST_IDS, UI, USER_ACCESS, VALUATION } from '../enums'

import Catalogs from './test-data/Catalogs.json'
import EmptyCatalogs from './test-data/EmptyCatalogs.json'

const { language, testUserId } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

const setup = () => {
  const { getAllByText, getByTestId, getByText, getByPlaceholderText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppHome />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByTestId, getByText, getByPlaceholderText }
}

test('Renders correctly', () => {
  useAxios.mockReturnValue([{ data: EmptyCatalogs, loading: false, error: null, response: null }, refetch])
  const { getByText } = setup()

  expect(getByText(USER_ACCESS.GUIDE[0][language])).toBeInTheDocument()
})

test('Functions correctly on good response', async () => {
  useAxios.mockReturnValue([{
    data: EmptyCatalogs,
    loading: false,
    error: null,
    response: { response: { statusText: USER_ACCESS.VERDICTS.OK } }
  }, refetch])
  const { getByText , getByPlaceholderText} = setup()

  await userEvent.type(getByPlaceholderText(UI.USER[language]), testUserId)
  userEvent.click(getByText(PRIVILEGE[AUTH_API.ENUMS.PRIVILEGES[2]][language]))
  userEvent.click(getByText(USER_ACCESS.CHECK[language]))

  expect(refetch).toHaveBeenCalled()
})

test('Functions correctly on bad response', async () => {
  useAxios.mockReturnValue([{
    data: EmptyCatalogs,
    loading: false,
    error: { response: { statusText: USER_ACCESS.VERDICTS.FORBIDDEN } },
    response: null
  }, refetch])
  const { getByText, getByPlaceholderText } = setup()

  await userEvent.type(getByPlaceholderText(UI.USER[language]), testUserId)
  userEvent.click(getByText(DATASET_STATE[AUTH_API.ENUMS.STATES[2]][language]))
  userEvent.click(getByText(VALUATION[AUTH_API.ENUMS.VALUATIONS[2]][language]))
  userEvent.click(getByText(USER_ACCESS.CHECK[language]))

  expect(refetch).toHaveBeenCalled()
})

test('Adding paths works correctly', async () => {
  useAxios.mockReturnValue([{ data: Catalogs, loading: false, error: null, response: null }, refetch])
  const { getAllByText, getByTestId } = setup()

  // https://dev.to/jacobwicks/testing-a-semantic-ui-react-input-with-react-testing-library-5d75
  await userEvent.type(getByTestId(TEST_IDS.SEARCH_DROPDOWN).children[0], '/test/3')
  userEvent.click(getAllByText(UI.ADD[language])[1])
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null, response: null }, refetch])
  setup()
})
