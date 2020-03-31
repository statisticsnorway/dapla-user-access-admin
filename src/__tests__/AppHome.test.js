import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'

import { AppHome } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_IDS, UI } from '../enums'
import { TEST_CONFIGURATIONS } from '../setupTests'

jest.mock('../components/role/RoleLookup', () => () => null)
jest.mock('../components/user/UpdateUser', () => () => null)
jest.mock('../components/group/GroupLookup', () => () => null)
jest.mock('../components/access/UserAccess', () => () => null)

const { alternativeTestUserId, apiContext, language, refetch, returnUser } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppHome />
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

test('Changing user works correctly', () => {
  useAxios.mockReturnValue([{ data: returnUser, loading: false, error: null }, refetch])
  const { getByPlaceholderText, getByTestId } = setup()

  userEvent.type(getByPlaceholderText(UI.USER[language]), alternativeTestUserId)
  userEvent.click(getByTestId(TEST_IDS.REFRESH_USER))

  expect(refetch).toHaveBeenCalled()
})
