import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { UpdateUser } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, USER } from '../enums'

import Roles from './test-data/Roles.json'
import Groups from './test-data/Groups.json'
import TestUser from './test-data/TestUser.json'
import UpdatedTestUser from './test-data/UpdatedTestUser.json'

const { alternativeTestUserId, language, responseObject } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const execute = jest.fn()

const setup = (isNew, user) => {
  const { getAllByText, getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <UpdateUser isNew={isNew} refetch={jest.fn()} user={user} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByPlaceholderText, getByTestId, getByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue(
      [{ data: { ...Roles, ...Groups }, loading: false, error: null, response: responseObject }, execute]
    )
  })

  test('Renders correctly on new user', () => {
    const { getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_USER))

    expect(getByPlaceholderText(USER.USER_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update user', () => {
    const { getByPlaceholderText, getByTestId } = setup(false, TestUser)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_USER))

    expect(getByPlaceholderText(USER.USER_ID[language])).toBeDisabled()
  })

  test('Functions correctly on PUT request', async () => {
    const { getAllByText, getByPlaceholderText, getByTestId, getByText } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_USER))
    await userEvent.type(getByPlaceholderText(USER.USER_ID[language]), alternativeTestUserId)
    userEvent.click(getByText(Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]]))
    userEvent.click(getByText(Groups[AUTH_API.GROUPS][0][AUTH_API.GROUP_OBJECT.STRING[0]]))
    userEvent.click(getAllByText(USER.CREATE_USER[language])[1])

    expect(execute).toHaveBeenNthCalledWith(3, UpdatedTestUser)
  })
})
