import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppRoles } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { PRIVILEGE, ROLES, TEST_IDS, UI } from '../enums'

import Roles from './test-data/Roles.json'

const { language, errorString } = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = () => {
  const { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <AppRoles />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ data: Roles, error: undefined, loading: false }, refetch])
  })

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(ROLES.CREATE_ROLE[language])).toBeInTheDocument()
  })

  test('Refresh table works correctly', () => {
    const { getByTestId } = setup()

    userEvent.click(getByTestId(TEST_IDS.TABLE_REFRESH))

    expect(refetch).toHaveBeenCalledTimes(1)
  })

  test('Filter function works correctly', () => {
    const { getByText, getByPlaceholderText, queryByText } = setup()

    expect(getByText(Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]])).toBeInTheDocument()

    userEvent.type(getByPlaceholderText(UI.FILTER_TABLE[language]), Roles[AUTH_API.ROLES][1][AUTH_API.ROLE_OBJECT.STRING[0]])

    expect(queryByText(Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]])).toBeNull()
  })

  test('Filter pure user roles works correctly', () => {
    const { getByText, getByTestId, queryByText } = setup()

    expect(getByText(Roles[AUTH_API.ROLES][3][AUTH_API.ROLE_OBJECT.STRING[0]])).toBeInTheDocument()

    userEvent.click(getByTestId(TEST_IDS.TABLE_FILTER_USER_ROLES_TOGGLE))

    expect(queryByText(Roles[AUTH_API.ROLES][3][AUTH_API.ROLE_OBJECT.STRING[0]])).toBeNull()

    userEvent.click(getByTestId(TEST_IDS.TABLE_FILTER_USER_ROLES_TOGGLE))

    expect(getByText(Roles[AUTH_API.ROLES][3][AUTH_API.ROLE_OBJECT.STRING[0]])).toBeInTheDocument()
  })

  test('Sort function works correctly', () => {
    const { getAllByText, getByTestId } = setup()
    const searchText = 'role'

    expect(getAllByText(searchText, { exact: false })[2])
      .toHaveTextContent(Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]])

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))

    expect(getAllByText(searchText, { exact: false })[2])
      .toHaveTextContent(Roles[AUTH_API.ROLES][3][AUTH_API.ROLE_OBJECT.STRING[0]])

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))

    expect(getAllByText(searchText, { exact: false })[2])
      .toHaveTextContent(Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]])
  })

  test('Toggle simple roles view works correctly', () => {
    const { getByTestId, getAllByText, queryByText } = setup()

    userEvent.click(getByTestId(TEST_IDS.SIMPLE_ROLES_VIEW_TOGGLE))

    expect(getAllByText(PRIVILEGE.DEPSEUDO[language])).toHaveLength(2)

    userEvent.click(getByTestId(TEST_IDS.SIMPLE_ROLES_VIEW_TOGGLE))

    expect(queryByText(PRIVILEGE.DEPSEUDO[language])).toBeNull()
  })
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, error: undefined, loading: true }, refetch])

  const { queryByText } = setup()

  expect(queryByText(ROLES.CREATE_ROLE[language])).toBeNull()
})

test('Shows error', () => {
  useAxios.mockReturnValue([{ data: undefined, error: errorString, loading: false }, refetch])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
