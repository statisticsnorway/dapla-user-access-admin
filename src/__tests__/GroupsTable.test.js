import React from 'react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import { GroupsTable } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, UI } from '../enums'

import Groups from './test-data/Groups.json'

jest.mock('../components/group/UpdateGroup', () => () => null)

const { errorObject, errorString, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <GroupsTable />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: Groups, loading: false, error: null }, refetch])

  test('Renders correctly', () => {
    const { getByPlaceholderText } = setup()

    expect(getByPlaceholderText(UI.FILTER_TABLE[language])).toBeInTheDocument()
  })

  test('Filters correctly', async () => {
    const { getByPlaceholderText, queryAllByText } = setup()

    await userEvent.type(
      getByPlaceholderText(UI.FILTER_TABLE[language]),
      Groups[AUTH_API.GROUPS][1][AUTH_API.GROUP_OBJECT.STRING[0]]
    )

    expect(queryAllByText(Groups[AUTH_API.GROUPS][0][AUTH_API.GROUP_OBJECT.STRING[0]])).toHaveLength(0)
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
