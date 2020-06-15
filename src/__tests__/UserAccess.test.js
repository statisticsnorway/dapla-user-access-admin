import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UserAccess } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { DATASET_STATE, PRIVILEGE, TEST_IDS, UI, USER_ACCESS, VALUATION } from '../enums'

const { emptyCatalogs, language, returnCatalogs, testUserId } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

const setup = () => {
  const { getAllByText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <UserAccess userId={testUserId} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByTestId, getByText }
}

test('Renders correctly', () => {
  useAxios.mockReturnValue([{ data: emptyCatalogs, loading: false, error: null, response: null }, refetch])
  const { getByText } = setup()

  expect(getByText(USER_ACCESS.HEADER[language])).toBeInTheDocument()
})

test('Functions correctly on good response', () => {
  useAxios.mockReturnValue([{
    data: emptyCatalogs,
    loading: false,
    error: null,
    response: { response: { statusText: USER_ACCESS.VERDICTS.OK } }
  }, refetch])
  const { getByText } = setup()

  userEvent.click(getByText(PRIVILEGE[AUTH_API.ENUMS.PRIVILEGES[2]][language]))
  userEvent.click(getByText(USER_ACCESS.CHECK[language]))

  expect(refetch).toHaveBeenCalled()
})

test('Functions correctly on bad response', () => {
  useAxios.mockReturnValue([{
    data: emptyCatalogs,
    loading: false,
    error: { response: { statusText: USER_ACCESS.VERDICTS.FORBIDDEN } },
    response: null
  }, refetch])
  const { getByText } = setup()

  userEvent.click(getByText(DATASET_STATE[AUTH_API.ENUMS.STATES[2]][language]))
  userEvent.click(getByText(VALUATION[AUTH_API.ENUMS.VALUATIONS[2]][language]))
  userEvent.click(getByText(USER_ACCESS.CHECK[language]))

  expect(refetch).toHaveBeenCalled()
})

test('Adding paths works correctly', async () => {
  useAxios.mockReturnValue([{ data: returnCatalogs, loading: false, error: null, response: null }, refetch])
  const { getAllByText, getByTestId } = setup()

  await userEvent.type(getByTestId(TEST_IDS.SEARCH_DROPDOWN).children[0], '/test/3') // https://dev.to/jacobwicks/testing-a-semantic-ui-react-input-with-react-testing-library-5d75
  userEvent.click(getAllByText(UI.ADD[language])[1])

  expect(refetch).toHaveBeenCalled()
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null, response: null }, refetch])
  setup()
})
