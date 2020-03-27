import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UserAccess } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { API } from '../configurations'
import { TEST_IDS, UI, USER_ACCESS } from '../enums'
import { TEST_CONFIGURATIONS } from '../setupTests'

const { apiContext, emptyCatalogs, language, refetch, returnCatalogs, testUserId } = TEST_CONFIGURATIONS

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
  expect(getByText(USER_ACCESS.CHECK[language])).toBeInTheDocument()
})

test('Functions correctly on good response', () => {
  useAxios.mockReturnValue([{
    data: emptyCatalogs,
    loading: false,
    error: null,
    response: { response: { statusText: USER_ACCESS.VERDICTS.OK } }
  }, refetch])
  const { getByText } = setup()

  userEvent.click(getByText(API.ENUMS.PRIVILEGES[2]))
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

  userEvent.click(getByText(API.ENUMS.STATES[2]))
  userEvent.click(getByText(API.ENUMS.VALUATIONS[2]))
  userEvent.click(getByText(USER_ACCESS.CHECK[language]))

  expect(refetch).toHaveBeenCalled()
})

test('Adding namespacePrefix works correctly', () => {
  useAxios.mockReturnValue([{ data: returnCatalogs, loading: false, error: null, response: null }, refetch])
  const { getAllByText, getByTestId } = setup()

  userEvent.type(getByTestId(TEST_IDS.SEARCH_DROPDOWN).children[0], '/test/2') // https://dev.to/jacobwicks/testing-a-semantic-ui-react-input-with-react-testing-library-5d75
  userEvent.click(getAllByText(UI.ADD[language])[1])

  expect(refetch).toHaveBeenCalled()
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null, response: null }, refetch])
  setup()
})
