import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CatalogUserLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { CATALOG_API, TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS } from '../enums'

const { errorObject, language, returnCatalogAccessUsers } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())

const setup = (error, data, loading) => {
  const { getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <CatalogUserLookup
          error={error}
          loading={loading}
          direction='descending'
          handleSort={jest.fn()}
          catalogAccess={returnCatalogAccessUsers[CATALOG_API.CATALOG_ACCESS]}
        />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByTestId, getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup(null, returnCatalogAccessUsers[CATALOG_API.CATALOG_ACCESS], false)

  expect(getByText('rannveig')).toBeInTheDocument()
})

test('Sorts correctly', () => {
  const { getByTestId } = setup(null, returnCatalogAccessUsers[CATALOG_API.CATALOG_ACCESS], false)

  userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))
  userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))
})

test('Renders on error', () => {
  setup(errorObject, undefined, false)
})
