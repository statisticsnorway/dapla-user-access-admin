import React, { useState } from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'

import { CatalogUserLookup, RoleLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'
import { UI } from '../enums'


const { errorObject, language, returnCatalogAccessUsers, testCatalogPath, testCatalogValuation, testCatalogState } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

const setup = () => {
  const { getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <CatalogUserLookup path={testCatalogPath} valuation={testCatalogValuation} state={testCatalogState} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText }
}

describe('Common mock', () => {

  test('Renders correctly', () => {
    useAxios.mockReturnValue([{ data: returnCatalogAccessUsers, loading: false, error: null }, refetch])
    const { getByText } = setup()

    expect(getByText('rannveig')).toBeInTheDocument()
    expect(getByText(description)).toBeInTheDocument()
  })

  test('Renders on error', () => {
    useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }, refetch])
    setup()
  })

})