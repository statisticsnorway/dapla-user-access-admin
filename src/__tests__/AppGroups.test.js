import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppGroups } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { GROUPS, TEST_IDS, UI } from '../enums'

import Groups from './test-data/Groups.json'

const { language, errorString } = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = () => {
  const { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <AppGroups />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ data: Groups, error: undefined, loading: false }, refetch])
  })

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(GROUPS.CREATE_GROUP[language])).toBeInTheDocument()
  })

  test('Refresh table works correctly', () => {
    const { getByTestId } = setup()

    userEvent.click(getByTestId(TEST_IDS.TABLE_REFRESH))

    expect(refetch).toHaveBeenCalledTimes(1)
  })

  test('Filter function works correctly', () => {
    const { getByText, getByPlaceholderText, queryByText } = setup()

    expect(getByText(Groups[AUTH_API.GROUPS][0][AUTH_API.GROUP_OBJECT.STRING[0]])).toBeInTheDocument()

    userEvent.type(getByPlaceholderText(UI.FILTER_TABLE[language]), Groups[AUTH_API.GROUPS][1][AUTH_API.GROUP_OBJECT.STRING[0]])

    expect(queryByText(Groups[AUTH_API.GROUPS][0][AUTH_API.GROUP_OBJECT.STRING[0]])).toBeNull()
  })

  test('Sort function works correctly', () => {
    const { getAllByText, getByTestId } = setup()
    const searchText = 'group'

    expect(getAllByText(searchText, { exact: false })[0])
      .toHaveTextContent(Groups[AUTH_API.GROUPS][0][AUTH_API.GROUP_OBJECT.STRING[0]])

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))

    expect(getAllByText(searchText, { exact: false })[0])
      .toHaveTextContent(Groups[AUTH_API.GROUPS][4][AUTH_API.GROUP_OBJECT.STRING[0]])

    userEvent.click(getByTestId(TEST_IDS.TABLE_SORT))

    expect(getAllByText(searchText, { exact: false })[0])
      .toHaveTextContent(Groups[AUTH_API.GROUPS][0][AUTH_API.GROUP_OBJECT.STRING[0]])
  })
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, error: undefined, loading: true }, refetch])

  const { queryByText } = setup()

  expect(queryByText(GROUPS.CREATE_GROUP[language])).toBeNull()
})

test('Shows error', () => {
  useAxios.mockReturnValue([{ data: undefined, error: errorString, loading: false }, refetch])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
