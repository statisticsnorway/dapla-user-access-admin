import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { CatalogsTable } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { CATALOG_API, TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, UI } from '../enums'

jest.mock('../components/catalog/CatalogUserLookup', () => () => null)

const { errorObject, errorString, language, returnCatalogs } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <CatalogsTable />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: returnCatalogs, loading: false, error: null }, refetch])

  test('Renders correctly', () => {
    const { getByPlaceholderText } = setup()

    expect(getByPlaceholderText(UI.FILTER_TABLE[language])).toBeInTheDocument()
  })

  test('Filters correctly', () => {
    const { getByPlaceholderText, queryAllByText } = setup()

    userEvent.type(
      getByPlaceholderText(UI.FILTER_TABLE[language]),
      returnCatalogs[CATALOG_API.CATALOGS][1].id.path
    )

    expect(queryAllByText(returnCatalogs[CATALOG_API.CATALOGS][0].id.path)).toHaveLength(0)
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
