import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UpdateUser } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, USER } from '../enums'

const {
  alternativeTestUserId,
  language,
  responseObject,
  returnGroups,
  returnRoles,
  testUser,
  updatedTestUser
} = TEST_CONFIGURATIONS
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
  useAxios.mockReturnValue(
    [{ data: { ...returnRoles, ...returnGroups }, loading: false, error: null, response: responseObject }, execute]
  )

  test('Renders correctly on new user', () => {
    const { getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_USER))

    expect(getByPlaceholderText(USER.USER_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update user', () => {
    const { getByPlaceholderText, getByTestId } = setup(false, testUser)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_USER))

    expect(getByPlaceholderText(USER.USER_ID[language])).toBeDisabled()
  })

  test('Functions correctly on PUT request', () => {
    const { getAllByText, getByPlaceholderText, getByTestId, getByText } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_USER))
    userEvent.type(getByPlaceholderText(USER.USER_ID[language]), alternativeTestUserId)
    userEvent.click(getByText(returnRoles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]]))
    userEvent.click(getByText(returnGroups[AUTH_API.GROUPS][0][AUTH_API.GROUP_OBJECT.STRING[0]]))
    userEvent.click(getAllByText(USER.CREATE_USER[language])[1])

    expect(execute).toHaveBeenNthCalledWith(7, updatedTestUser)
  })
})
