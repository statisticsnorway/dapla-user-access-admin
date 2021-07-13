import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { UpdateUser } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { APP, AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { USERS } from '../enums'

import Roles from './test-data/Roles.json'
import Groups from './test-data/Groups.json'
import TestUser from './test-data/TestUser.json'

const { language, errorResponse, responseObject } = TEST_CONFIGURATIONS
const executePut = jest.fn()

const setup = (isNew, user = undefined) => {
  const { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={[{ pathname: `${APP[0].route}/update`, state: { isNew: isNew, user: user } }]}>
        <UpdateUser />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue(
      [{ data: { ...Roles, ...Groups }, loading: false, error: undefined, response: responseObject }, executePut]
    )
  })

  test('Renders correctly on new user', () => {
    const { getByPlaceholderText } = setup(true)

    expect(getByPlaceholderText(USERS.USER_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update user', () => {
    const { getByPlaceholderText } = setup(false, TestUser)

    expect(getByPlaceholderText(USERS.USER_ID[language])).toBeDisabled()
  })

  test('Handles creating new user correctly', () => {
    const { getAllByText, getByText, getByPlaceholderText } = setup(true)

    userEvent.type(getByPlaceholderText(USERS.USER_ID[language]), 'testUser2')
    userEvent.click(getByText(Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]]))
    userEvent.click(getByText(Groups[AUTH_API.GROUPS][0][AUTH_API.GROUP_OBJECT.STRING[0]]))
    userEvent.click(getAllByText(USERS.CREATE_USER[language])[1])

    expect(executePut).toHaveBeenCalledWith({
      data: {
        userId: 'testUser2',
        groups: ['group1'],
        roles: ['roleId1']
      },
      url: `${window.__ENV.REACT_APP_API_AUTH}${AUTH_API.PUT_USER('testUser2')}`
    })
  })
})

test('Handles errors when creating/updating a user', () => {
  useAxios.mockReturnValue(
    [{ data: { ...Roles, ...Groups }, loading: false, error: undefined, response: undefined }, executePut]
  )

  const { getAllByText, getByText } = setup(true)

  userEvent.click(getAllByText(USERS.CREATE_USER[language])[1])

  expect(executePut).not.toHaveBeenCalled()
  expect(getByText(USERS.INVALID(AUTH_API.USER_OBJECT.STRING, language))).toBeInTheDocument()
  expect(getByText(USERS.INVALID(AUTH_API.USER_OBJECT.ARRAY[0], language))).toBeInTheDocument()
  expect(getByText(USERS.INVALID(AUTH_API.USER_OBJECT.ARRAY[1], language))).toBeInTheDocument()
})

test('Handles unable to fetch groups/roles', () => {
  useAxios.mockReturnValue(
    [{ data: undefined, loading: false, error: errorResponse, response: undefined }, executePut]
  )

  const { getByText } = setup(true)

  expect(getByText(errorResponse.response.status)).toBeInTheDocument()
})
