import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UsersTable } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API, ROUTING, TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, UI } from '../enums'

jest.mock('../components/user/UpdateUser', () => () => null)

const { errorObject, errorString, language, returnUsers } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <MemoryRouter initialEntries={[ROUTING.USERS]}>
          <UsersTable />
        </MemoryRouter>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: returnUsers, loading: false, error: null }, refetch])

  test('Renders correctly', () => {
    const { getByPlaceholderText } = setup()

    expect(getByPlaceholderText(UI.FILTER_TABLE[language])).toBeInTheDocument()
  })

  test('Filters correctly', async () => {
    const { getByPlaceholderText, queryAllByText } = setup()

    await userEvent.type(
      getByPlaceholderText(UI.FILTER_TABLE[language]),
      returnUsers[AUTH_API.USERS][1][AUTH_API.USER_OBJECT.STRING]
    )

    expect(queryAllByText(returnUsers[AUTH_API.USERS][0][AUTH_API.USER_OBJECT.STRING])).toHaveLength(0)
  })

  test('Sorts correctly', () => {
    const { getByTestId } = setup()

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))
    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))
  })
})

test('Renders on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }, refetch])
  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null }, refetch])
  setup()
})
