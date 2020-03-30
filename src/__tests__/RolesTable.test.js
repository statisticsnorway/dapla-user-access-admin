import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { RolesTable } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_IDS, UI } from '../enums'
import { TEST_CONFIGURATIONS } from '../setupTests'

jest.mock('../components/role/UpdateRole', () => () => null)

const { apiContext, language, refetch, returnRoles } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByPlaceholderText, getByTestId, queryAllByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <RolesTable />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, queryAllByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: returnRoles, loading: false, error: null }, refetch])

  test('Renders correctly', () => {
    const { getByPlaceholderText } = setup()

    expect(getByPlaceholderText(UI.FILTER_TABLE[language])).toBeInTheDocument()
  })

  test('Filters correctly', () => {
    const { getByPlaceholderText, queryAllByText } = setup()

    userEvent.type(getByPlaceholderText(UI.FILTER_TABLE[language]), returnRoles.roles[1].roleId)

    expect(queryAllByText(returnRoles.roles[0].roleId)).toHaveLength(0)
  })

  test('Sorts correctly', () => {
    const { getByTestId } = setup()

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))
    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))
  })
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null }, refetch])
  setup()
})
