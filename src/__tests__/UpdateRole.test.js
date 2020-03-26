import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UpdateRole } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { API } from '../configurations'
import { ROLE, TEST_IDS } from '../enums'
import { TEST_CONFIGURATIONS } from '../setupTests'

const { alternativeTestUserId, apiContext, emptyRole, executePut, language, testRole } = TEST_CONFIGURATIONS

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
  useAxios.mockReturnValue([{ data: { [API.CATALOGS]: [] }, loading: false, error: null, response: null }, executePut])

  test('Renders correctly on new role', () => {
    const { getAllByText, getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))

    expect(getAllByText(ROLE.CREATE_ROLE[language])).toHaveLength(2)
    expect(getByPlaceholderText(ROLE.ROLE_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update role', () => {
    const { getByPlaceholderText, getByTestId } = setup(false, testRole)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))

    expect(getByPlaceholderText(ROLE.ROLE_ID[language])).toBeDisabled()
  })

  test('Functions correctly on PUT request', () => {
    const { getAllByText, getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_ROLE))
    userEvent.type(getByPlaceholderText(ROLE.ROLE_ID[language]), alternativeTestUserId)
    userEvent.click(getAllByText(ROLE.CREATE_ROLE[language])[1])

    expect(executePut).toHaveBeenCalledWith(emptyRole)
  })
})
