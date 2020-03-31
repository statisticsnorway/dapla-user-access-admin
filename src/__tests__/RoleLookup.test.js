import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'

import { RoleLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API } from '../configurations'
import { TEST_CONFIGURATIONS } from '../setupTests'

jest.mock('../components/role/UpdateRole', () => () => null)

const { apiContext, errorObject, language, refetch, testRole, testRoleId } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <RoleLookup roleId={testRoleId} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  useAxios.mockReturnValue([{ data: testRole, loading: false, error: null }, refetch])
  const { getByText } = setup()

  const { roleId, description, paths, maxValuation } = testRole

  expect(getByText(roleId)).toBeInTheDocument()
  expect(getByText(description)).toBeInTheDocument()
  expect(getByText(maxValuation)).toBeInTheDocument()
  expect(getByText(paths[AUTH_API.INCLUDES][0])).toBeInTheDocument()
  expect(getByText(paths[AUTH_API.INCLUDES][1])).toBeInTheDocument()
})

test('Renders on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }, refetch])
  setup()
})
