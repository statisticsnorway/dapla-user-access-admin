import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { UpdateGroup } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { APP, AUTH_API, TEST_CONFIGURATIONS, UPDATE } from '../configurations'
import { GROUPS, TEST_IDS } from '../enums'

import Roles from './test-data/Roles.json'
import TestGroup from './test-data/TestUser.json'

const { language, errorResponse, responseObject } = TEST_CONFIGURATIONS
const executePutOrRefreshDropdown = jest.fn()

const setup = (isNew, group = undefined) => {
  const { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={[{ pathname: `${APP[1].route}${UPDATE}`, state: { isNew: isNew, group: group } }]}>
        <UpdateGroup />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue(
      [{ data: Roles, loading: false, error: undefined, response: responseObject }, executePutOrRefreshDropdown]
    )
  })

  test('Renders correctly on new group', () => {
    const { getByPlaceholderText } = setup(true)

    expect(getByPlaceholderText(GROUPS.GROUP_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update group', () => {
    const { getByPlaceholderText } = setup(false, TestGroup)

    expect(getByPlaceholderText(GROUPS.GROUP_ID[language])).toBeDisabled()
  })

  test('Handles creating new user correctly', () => {
    const { getAllByText, getByText, getByPlaceholderText } = setup(true)

    userEvent.type(getByPlaceholderText(GROUPS.GROUP_ID[language]), 'testGroup')
    userEvent.type(getByPlaceholderText(GROUPS.DESCRIPTION[language]), 'testGroupDescription')
    userEvent.click(getByText(Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]]))
    userEvent.click(getAllByText(GROUPS.CREATE_GROUP[language])[1])

    expect(executePutOrRefreshDropdown).toHaveBeenCalledWith({
      data: {
        groupId: 'testGroup',
        description: 'testGroupDescription',
        roles: [Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]]]
      },
      url: `${window.__ENV.REACT_APP_API_AUTH}${AUTH_API.PUT_GROUP('testGroup')}`
    })
  })

  test('Handles refetching on dropdowns', () => {
    const { getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.DROPDOWN_REFRESH))

    expect(executePutOrRefreshDropdown).toHaveBeenCalledWith()
    expect(executePutOrRefreshDropdown).toHaveBeenCalledTimes(1)
  })
})

test('Handles errors when creating/updating a group', () => {
  useAxios.mockReturnValue(
    [{ data: Roles, loading: false, error: undefined, response: undefined }, executePutOrRefreshDropdown]
  )

  const { getAllByText, getByText } = setup(true)

  userEvent.click(getAllByText(GROUPS.CREATE_GROUP[language])[1])

  expect(executePutOrRefreshDropdown).not.toHaveBeenCalled()
  expect(getByText(GROUPS.INVALID(AUTH_API.GROUP_OBJECT.STRING[0], language))).toBeInTheDocument()
  expect(getByText(GROUPS.INVALID(AUTH_API.GROUP_OBJECT.STRING[1], language))).toBeInTheDocument()
  expect(getByText(GROUPS.INVALID(AUTH_API.GROUP_OBJECT.ARRAY, language))).toBeInTheDocument()
})

test('Handles unable to fetch roles', () => {
  useAxios.mockReturnValue(
    [{ data: undefined, loading: false, error: errorResponse, response: undefined }, executePutOrRefreshDropdown]
  )

  const { getByText } = setup(true)

  expect(getByText(errorResponse.response.status)).toBeInTheDocument()
})
