import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppHome } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, UI } from '../enums'

import User from './test-data/User.json'

jest.mock('../components/role/RoleLookup', () => () => null)
jest.mock('../components/user/UpdateUser', () => () => null)
jest.mock('../components/group/GroupLookup', () => () => null)
jest.mock('../components/access/UserAccess', () => () => null)

const { alternativeTestUserId, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <MemoryRouter initialEntries={['/']}>
          <AppHome />
        </MemoryRouter>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

test('Renders correctly', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: null }, refetch])
  const { getByText } = setup()

  expect(getByText(UI.USER[language])).toBeInTheDocument()
})

test('Changing user works correctly', async () => {
  useAxios.mockReturnValue([{ data: User, loading: false, error: null }, refetch])
  const { getByPlaceholderText, getByTestId } = setup()

  await userEvent.type(getByPlaceholderText(UI.USER[language]), alternativeTestUserId)
  userEvent.click(getByTestId(TEST_IDS.REFRESH_USER))

  expect(refetch).toHaveBeenCalled()
})
