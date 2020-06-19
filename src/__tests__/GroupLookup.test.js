import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'

import { GroupLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'

jest.mock('../components/role/UpdateRole', () => () => null)
jest.mock('../components/role/RoleLookup', () => () => null)

const { errorObject, language, testGroup, testGroupId } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

const setup = () => {
  const { getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <GroupLookup groupId={testGroupId} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  useAxios.mockReturnValue([{ data: testGroup, loading: false, error: null }, refetch])
  const { groupId, description, roles } = testGroup
  const { getByText } = setup()

  expect(getByText(groupId)).toBeInTheDocument()
  expect(getByText(description)).toBeInTheDocument()
  expect(getByText(roles[0])).toBeInTheDocument()
  expect(getByText(roles[1])).toBeInTheDocument()
})

test('Renders on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }, refetch])
  setup()
})
