import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UpdateRole } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { API } from '../configurations'
import { LANGUAGE, ROLE, TEST_IDS } from '../enums'

const language = LANGUAGE.LANGUAGES.ENGLISH.languageCode
const api = { authApi: process.env.REACT_APP_API_AUTH, catalogApi: process.env.REACT_APP_API_CATALOG }
const apiContext = { ...api, setAuthApi: jest.fn(), setCatalogApi: jest.fn() }

const setup = (isNew, role) => {
  const { getAllByText, getByPlaceholderText, getByTestId } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <UpdateRole isNew={isNew} refetch={jest.fn()} role={role} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByPlaceholderText, getByTestId }
}

describe('Common mock', () => {
  const executePut = jest.fn()
  useAxios.mockReturnValue([{ loading: false, error: null, response: null }, executePut])

  test('Renders correctly on new role', () => {

    const { getAllByText, getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))

    expect(getAllByText(ROLE.CREATE_ROLE[language])).toHaveLength(2)
    expect(getByPlaceholderText(ROLE.ROLE_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update role', () => {
    const role = {
      roleId: 'test',
      states: [API.ENUMS.STATES[1]],
      privileges: [API.ENUMS.PRIVILEGES[1]],
      maxValuation: API.ENUMS.VALUATIONS[1],
      namespacePrefixes: ['/test/1', '/test/2']
    }
    const { getByPlaceholderText, getByTestId } = setup(false, role)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))

    expect(getByPlaceholderText(ROLE.ROLE_ID[language])).toBeDisabled()
  })

  test('Functions correctly on PUT request', () => {
    const { getAllByText, getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))
    userEvent.type(getByPlaceholderText(ROLE.ROLE_ID[language]), 'test')
    userEvent.click(getAllByText(ROLE.CREATE_ROLE[language])[1])

    expect(executePut).toHaveBeenCalledWith({
      data: {
        roleId: 'test',
        states: [],
        privileges: [],
        maxValuation: '',
        namespacePrefixes: []
      }
    })
  })
})
