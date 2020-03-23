import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'

import { RoleLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { API } from '../configurations'
import { LANGUAGE } from '../enums'

const refetch = jest.fn()
const language = LANGUAGE.LANGUAGES.ENGLISH.languageCode
const api = { authApi: process.env.REACT_APP_API_AUTH, catalogApi: process.env.REACT_APP_API_CATALOG }
const apiContext = { ...api, setAuthApi: jest.fn(), setCatalogApi: jest.fn() }

const setup = () => {
  const { getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <RoleLookup roleId='test' />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const role = {
    roleId: 'test',
    states: [API.ENUMS.STATES[1]],
    privileges: [API.ENUMS.PRIVILEGES[1]],
    maxValuation: API.ENUMS.VALUATIONS[1],
    namespacePrefixes: ['/test/1', '/test/2']
  }
  useAxios.mockReturnValue([{ data: role, loading: false, error: null }, refetch])
  const { getByText } = setup()

  Object.keys(role).forEach(key => {
    expect(getByText(key)).toBeInTheDocument()
    expect(getByText(role[key].toString())).toBeInTheDocument()
  })
})
