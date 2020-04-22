import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'

import { CatalogUserLookupPortal } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'

jest.mock('../components/catalog/CatalogUserLookup', () => () => null)

const { errorObject, language, returnCatalogAccessUsers, testCatalogPath } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())

const setup = () => {
  const { getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <CatalogUserLookupPortal
          index={0}
          open={[true]}
          path={testCatalogPath}
          handleOpen={jest.fn()}
          handleClose={jest.fn()}
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
    setup()
  })
})

test('Renders on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }])
  setup()
})
