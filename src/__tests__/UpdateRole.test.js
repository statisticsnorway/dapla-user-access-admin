import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UpdateRole } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { DATASET_STATE, PRIVILEGE, ROLE, TEST_IDS, UI } from '../enums'

const {
  alternativeTestRoleId,
  emptyCatalogs,
  emptyRole,
  language,
  responseObject,
  testRole,
  updatedTestRole
} = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const executePut = jest.fn()

const setup = (isNew, role) => {
  const { getAllByTestId, getAllByText, getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <UpdateRole isNew={isNew} refetch={jest.fn()} role={role} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByTestId, getAllByText, getByPlaceholderText, getByTestId, getByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue(
    [{ data: emptyCatalogs, loading: false, error: null, response: responseObject }, executePut]
  )

  test('Renders correctly on new role', () => {
    const { getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))

    expect(getByPlaceholderText(ROLE.ROLE_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update role', () => {
    const { getByPlaceholderText, getByTestId } = setup(false, testRole)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))

    expect(getByPlaceholderText(ROLE.ROLE_ID[language])).toBeDisabled()
  })

  test('Functions correctly on PUT request', () => {
    const { getAllByText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))
    userEvent.click(getAllByText(ROLE.CREATE_ROLE[language])[1])

    expect(executePut).toHaveBeenNthCalledWith(4, emptyRole)
  })

  test('Form changes works correctly', () => {
    const { getAllByTestId, getAllByText, getByPlaceholderText, getByTestId, getByText } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))
    userEvent.click(getByText(DATASET_STATE[AUTH_API.ENUMS.STATES[2]][language]))
    userEvent.click(getByText(DATASET_STATE[AUTH_API.ENUMS.STATES[6]][language]))
    userEvent.click(getByText(DATASET_STATE[AUTH_API.ENUMS.STATES[6]][language]))
    userEvent.click(getByText(PRIVILEGE[AUTH_API.ENUMS.PRIVILEGES[2]][language]))
    userEvent.click(getByText(PRIVILEGE[AUTH_API.ENUMS.PRIVILEGES[3]][language]))
    userEvent.click(getByText(PRIVILEGE[AUTH_API.ENUMS.PRIVILEGES[3]][language]))
    // https://dev.to/jacobwicks/testing-a-semantic-ui-react-input-with-react-testing-library-5d75
    userEvent.type(getAllByTestId(TEST_IDS.SEARCH_DROPDOWN)[0].children[0], '/test/3')
    userEvent.click(getByText(UI.ADD[language]))
    // https://dev.to/jacobwicks/testing-a-semantic-ui-react-input-with-react-testing-library-5d75
    userEvent.type(getAllByTestId(TEST_IDS.SEARCH_DROPDOWN)[1].children[0], '/test/4')
    userEvent.click(getByText(UI.ADD[language]))
    userEvent.type(getByPlaceholderText(ROLE.ROLE_ID[language]), alternativeTestRoleId)
    userEvent.type(getByPlaceholderText(ROLE.DESCRIPTION[language]), updatedTestRole.data.description)
    userEvent.click(getAllByText(ROLE.CREATE_ROLE[language])[1])

    expect(executePut).toHaveBeenNthCalledWith(6, updatedTestRole)
  })
})
