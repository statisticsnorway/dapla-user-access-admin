import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'

import { RoleLookup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_CONFIGURATIONS } from '../setupTests'

jest.mock('../components/role/UpdateRole', () => () => null)

const { apiContext, language, refetch, testRole, testRoleId } = TEST_CONFIGURATIONS

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

  Object.keys(testRole).forEach(key => {
    expect(getByText(key)).toBeInTheDocument()
    expect(getByText(testRole[key].toString())).toBeInTheDocument()
  })
})
