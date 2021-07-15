import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppUsers } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, UI, USERS } from '../enums'

import Users from './test-data/Users.json'

const { language, errorString } = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = () => {
  const { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <AppUsers />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ data: Users, error: undefined, loading: false }, refetch])
  })

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(USERS.CREATE_USER[language])).toBeInTheDocument()
  })

  test('Refresh table works correctly', () => {
    const { getByTestId } = setup()

    userEvent.click(getByTestId(TEST_IDS.TABLE_REFRESH))

    expect(refetch).toHaveBeenCalledTimes(1)
  })

  test('Filter function works correctly', () => {
    const { getByText, getByPlaceholderText, queryByText } = setup()

    expect(getByText(Users[AUTH_API.USERS][0][AUTH_API.USER_OBJECT.STRING])).toBeInTheDocument()

    userEvent.type(getByPlaceholderText(UI.FILTER_TABLE[language]), Users[AUTH_API.USERS][1][AUTH_API.USER_OBJECT.STRING])

    expect(queryByText(Users[AUTH_API.USERS][0][AUTH_API.USER_OBJECT.STRING])).toBeNull()
  })

  test('Sort function works correctly', () => {
    const { getAllByText, getByTestId } = setup()
    const searchText = 'user'

    expect(getAllByText(searchText, { exact: false })[0])
      .toHaveTextContent(Users[AUTH_API.USERS][0][AUTH_API.USER_OBJECT.STRING])

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))

    expect(getAllByText(searchText, { exact: false })[0])
      .toHaveTextContent(Users[AUTH_API.USERS][4][AUTH_API.USER_OBJECT.STRING])

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))

    expect(getAllByText(searchText, { exact: false })[0])
      .toHaveTextContent(Users[AUTH_API.USERS][0][AUTH_API.USER_OBJECT.STRING])
  })
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, error: undefined, loading: true }, refetch])

  const { queryByText } = setup()

  expect(queryByText(USERS.CREATE_USER[language])).toBeNull()
})

test('Shows error', () => {
  useAxios.mockReturnValue([{ data: undefined, error: errorString, loading: false }, refetch])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
