import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppRoles } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
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

    expect(getByText('roleId1')).toBeInTheDocument()

    userEvent.type(getByPlaceholderText(UI.FILTER_TABLE[language]), 'roleId2')

    expect(queryByText('roleId1')).toBeNull()
  })

  test('Filter pure user roles works correctly', () => {
    const { getByText, getByTestId, queryByText } = setup()

    expect(getByText('user.user1.roleId')).toBeInTheDocument()

    userEvent.click(getByTestId(TEST_IDS.TABLE_FILTER_USER_ROLES_TOGGLE))

    expect(queryByText('user.user1.roleId')).toBeNull()

    userEvent.click(getByTestId(TEST_IDS.TABLE_FILTER_USER_ROLES_TOGGLE))

    expect(getByText('user.user1.roleId')).toBeInTheDocument()
  })

  test('Sort function works correctly', () => {
    const { getAllByText, getByTestId } = setup()

    expect(getAllByText('role', { exact: false })[1]).toHaveTextContent('roleId1')

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))

    expect(getAllByText('role', { exact: false })[1]).toHaveTextContent('user.user1.roleId')

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))

    expect(getAllByText('role', { exact: false })[1]).toHaveTextContent('roleId1')
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
