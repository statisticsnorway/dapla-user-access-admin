import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { RolesTable } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_IDS, UI } from '../enums'
import { TEST_CONFIGURATIONS } from '../setupTests'
import { AUTH_API } from '../configurations'

jest.mock('../components/role/UpdateRole', () => () => null)

const { apiContext, errorObject, errorString, language, refetch, returnRoles } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <RolesTable />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: returnRoles, loading: false, error: null }, refetch])

  test('Renders correctly', () => {
    const { getByPlaceholderText } = setup()

    expect(getByPlaceholderText(UI.FILTER_TABLE[language])).toBeInTheDocument()
  })

  test('Filters correctly', () => {
    const { getByPlaceholderText, queryAllByText } = setup()

    userEvent.type(
      getByPlaceholderText(UI.FILTER_TABLE[language]),
      returnRoles[AUTH_API.ROLES][1][AUTH_API.ROLE_OBJECT.STRING[0]]
    )

    expect(queryAllByText(returnRoles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]])).toHaveLength(0)
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
