import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { UpdateRole } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { APP, AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { DATASET_STATE, PRIVILEGE, ROLES, TEST_IDS, UI, VALUATION } from '../enums'

import Catalogs from './test-data/Catalogs.json'
import TestRoles from './test-data/TestRoles.json'

const { language, errorResponse, responseObject } = TEST_CONFIGURATIONS
const executePut = jest.fn()

const setup = (isNew, role = undefined) => {
  const { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText, getAllByTestId } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={[{ pathname: `${APP[1].route}/update`, state: { isNew: isNew, role: role } }]}>
        <UpdateRole />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getAllByText, getByTestId, getByText, getByPlaceholderText, queryByText, getAllByTestId }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue(
      [{ data: Catalogs, loading: false, error: undefined, response: responseObject }, executePut]
    )
  })

  test('Renders correctly on new role', () => {
    const { getByPlaceholderText } = setup(true)

    expect(getByPlaceholderText(ROLES.ROLE_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update role', () => {
    const { getByPlaceholderText } = setup(false, TestRoles.testRoles[0])

    expect(getByPlaceholderText(ROLES.ROLE_ID[language])).toBeDisabled()
  })

  test('Renders correctly on update role with missing values', () => {
    const { getByPlaceholderText } = setup(false, TestRoles.testRoles[1])

    expect(getByPlaceholderText(ROLES.ROLE_ID[language])).toBeDisabled()
  })

  test('Renders correctly on update role with some missing values', () => {
    const { getByPlaceholderText } = setup(false, TestRoles.testRoles[2])

    expect(getByPlaceholderText(ROLES.ROLE_ID[language])).toBeDisabled()
  })

  test('Handles creating new role correctly', () => {
    const { getAllByText, getByText, getByPlaceholderText, getAllByTestId } = setup(true)

    userEvent.type(getByPlaceholderText(ROLES.ROLE_ID[language]), 'testRole')
    userEvent.type(getByPlaceholderText(ROLES.DESCRIPTION[language]), 'testRoleDescription')
    userEvent.click(getByText(PRIVILEGE.DELETE[language]))
    userEvent.click(getByText(PRIVILEGE.DELETE[language]))
    userEvent.click(getByText(PRIVILEGE.CREATE[language]))
    userEvent.click(getByText(DATASET_STATE.INPUT[language]))
    userEvent.click(getByText(VALUATION.OPEN[language]))
    // https://dev.to/jacobwicks/testing-a-semantic-ui-react-input-with-react-testing-library-5d75
    userEvent.type(getAllByTestId(TEST_IDS.SEARCH_DROPDOWN)[0].children[0], '/test/3')
    userEvent.click(getByText(UI.ADD[language]))
    // https://dev.to/jacobwicks/testing-a-semantic-ui-react-input-with-react-testing-library-5d75
    userEvent.type(getAllByTestId(TEST_IDS.SEARCH_DROPDOWN)[1].children[0], '/test/4')
    userEvent.click(getByText(UI.ADD[language]))
    userEvent.click(getAllByText(ROLES.CREATE_ROLE[language])[1])

    expect(executePut).toHaveBeenCalledWith({
      data: {
        roleId: 'testRole',
        description: 'testRoleDescription',
        paths: {
          includes: ['/test/3'],
          excludes: ['/test/4']
        },
        privileges: {
          includes: ['CREATE'],
          excludes: ['READ', 'UPDATE', 'DEPSEUDO', 'DELETE']
        },
        states: {
          includes: ['INPUT'],
          excludes: ['OTHER', 'OUTPUT', 'PROCESSED', 'PRODUCT', 'RAW', 'TEMP']
        },
        maxValuation: 'OPEN'
      },
      url: `${window.__ENV.REACT_APP_API_AUTH}${AUTH_API.PUT_ROLE('testRole')}`
    })
  })
})

test('Handles errors when creating/updating a role', () => {
  useAxios.mockReturnValue(
    [{ data: Catalogs, loading: false, error: undefined, response: undefined }, executePut]
  )

  const { getAllByText, getByText } = setup(true)

  userEvent.click(getAllByText(ROLES.CREATE_ROLE[language])[1])

  expect(executePut).not.toHaveBeenCalled()
  expect(getByText(ROLES.INVALID(AUTH_API.ROLE_OBJECT.STRING[0], language))).toBeInTheDocument()
  expect(getByText(ROLES.INVALID(AUTH_API.ROLE_OBJECT.STRING[1], language))).toBeInTheDocument()
  expect(getByText(ROLES.INVALID(AUTH_API.ROLE_OBJECT.ARRAY[0], language))).toBeInTheDocument()
  expect(getByText(ROLES.INVALID(AUTH_API.ROLE_OBJECT.ARRAY[1], language))).toBeInTheDocument()
  expect(getByText(ROLES.INVALID(AUTH_API.ROLE_OBJECT.ARRAY[2], language))).toBeInTheDocument()
  expect(getByText(ROLES.INVALID(AUTH_API.ROLE_OBJECT.ENUM, language))).toBeInTheDocument()
})

test('Handles complex errors when creating/updating a role', () => {
  useAxios.mockReturnValue(
    [{ data: Catalogs, loading: false, error: undefined, response: undefined }, executePut]
  )

  const { getAllByText, getByText } = setup(true)

  userEvent.click(getByText(DATASET_STATE.INPUT[language]))
  userEvent.click(getByText(VALUATION.INTERNAL[language]))
  userEvent.click(getAllByText('/test/1')[0])
  userEvent.click(getAllByText(ROLES.CREATE_ROLE[language])[1])

  expect(executePut).not.toHaveBeenCalled()
  expect(getByText(ROLES.INVALID('tooLowValuationScore', language))).toBeInTheDocument()
  expect(getByText(ROLES.INVALID('tooLowStatesScore', language))).toBeInTheDocument()
})

test('Handles unable to fetch catalogs', () => {
  useAxios.mockReturnValue(
    [{ data: undefined, loading: false, error: errorResponse, response: undefined }, executePut]
  )

  const { getByText } = setup(true)

  expect(getByText(errorResponse.response.status)).toBeInTheDocument()
})
