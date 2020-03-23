import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UpdateUser } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { LANGUAGE, TEST_IDS, USER } from '../enums'

const language = LANGUAGE.LANGUAGES.ENGLISH.languageCode
const api = { authApi: process.env.REACT_APP_API_AUTH, catalogApi: process.env.REACT_APP_API_CATALOG }
const apiContext = { ...api, setAuthApi: jest.fn(), setCatalogApi: jest.fn() }

const setup = (isNew, roles, userId) => {
  const { getAllByText, getByPlaceholderText, getByTestId } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <UpdateUser isNew={isNew} refetch={jest.fn()} roles={roles} userId={userId} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByPlaceholderText, getByTestId }
}

describe('Common mock', () => {
  const execute = jest.fn()
  useAxios.mockReturnValue([
    { data: { roles: [{ roleId: 'role1' }, { roleId: 'role2' }] }, loading: false, error: null, response: null },
    execute
  ])

  test('Renders correctly on new user', () => {
    const { getByPlaceholderText, getByTestId } = setup(true, [], '')

    userEvent.click(getByTestId(TEST_IDS.NEW_USER))

    expect(getByPlaceholderText(USER.USER_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update user', () => {
    const { getAllByText, getByPlaceholderText, getByTestId } = setup(false, ['role1', 'role2'], 'test')

    userEvent.click(getByTestId(TEST_IDS.UPDATE_USER))

    expect(getAllByText(USER.UPDATE_USER[language])).toHaveLength(2)
    expect(getByPlaceholderText(USER.USER_ID[language])).toBeDisabled()
  })

  test('Functions correctly on PUT request', () => {
    const { getAllByText, getByPlaceholderText, getByTestId } = setup(true, [], '')

    userEvent.click(getByTestId(TEST_IDS.NEW_USER))
    userEvent.type(getByPlaceholderText(USER.USER_ID[language]), 'test')
    userEvent.click(getAllByText(USER.CREATE_USER[language])[1])

    expect(execute).toHaveBeenCalledWith({ data: { userId: 'test', roles: [] } })
  })
})
