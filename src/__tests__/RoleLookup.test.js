import React from 'react'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import { RoleLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'

import TestRole from './test-data/TestRole.json'
import CorruptedTestRole from './test-data/CorruptedTestRole.json'

jest.mock('../components/role/UpdateRole', () => () => null)

global.console = {
  log: jest.fn()
}

const { errorObject, language, testRoleId } = TEST_CONFIGURATIONS
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
  useAxios.mockReturnValue([{ data: TestRole, loading: false, error: null }, refetch])
  const { getByText } = setup()

  const { roleId, description } = TestRole

  expect(getByText(roleId)).toBeInTheDocument()
  expect(getByText(description)).toBeInTheDocument()
})

test('Renders on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }, refetch])
  setup()
})

test('Displays fallback when makeEnum fails', () => {
  useAxios.mockReturnValue([{ data: CorruptedTestRole, loading: false, error: null }, refetch])
  const { getByText } = setup()

  expect(getByText('-')).toBeInTheDocument()
  expect(global.console.log).toHaveBeenCalledWith('unrecognizedElement')
})

