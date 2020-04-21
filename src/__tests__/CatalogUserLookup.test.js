import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'

import { CatalogUserLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import userEvent from '@testing-library/user-event'
import { TEST_IDS } from '../enums'

const { errorObject, language, returnCatalogAccessUsers, testCatalogPath } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())

const setup = () => {
  const { getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <CatalogUserLookup
          path={testCatalogPath}
          state={AUTH_API.ENUMS.STATES[1]}
          valuation={AUTH_API.ENUMS.VALUATIONS[3]}
        />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByTestId, getByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: returnCatalogAccessUsers, loading: false, error: null }])

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText('rannveig')).toBeInTheDocument()
  })

  test('Sorts correctly', () => {
    const { getByTestId } = setup()

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))
    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))
  })
})

test('Renders on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }])
  setup()
})
