import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'

import { RoleLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'

jest.mock('../components/role/UpdateRole', () => () => null)

const { errorObject, language, testRole, testRoleId } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

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

  const { roleId, description } = testRole

  expect(getByText(roleId)).toBeInTheDocument()
  expect(getByText(description)).toBeInTheDocument()
})

test('Renders on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }, refetch])
  setup()
})
