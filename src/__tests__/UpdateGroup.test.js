import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAxios from 'axios-hooks'

import { UpdateGroup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { GROUP, TEST_IDS } from '../enums'

const {
  alternativeTestGroupId,
  language,
  responseObject,
  returnRoles,
  testGroup,
  updatedTestGroup
} = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const execute = jest.fn()

const setup = (isNew, group) => {
  const { getAllByText, getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <UpdateGroup group={group} isNew={isNew} refetch={jest.fn()} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByPlaceholderText, getByTestId, getByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue(
    [{ data: returnRoles, loading: false, error: null, response: responseObject }, execute]
  )

  test('Renders correctly on new group', () => {
    const { getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_GROUP))

    expect(getByPlaceholderText(GROUP.GROUP_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update group', () => {
    const { getByPlaceholderText, getByTestId } = setup(false, testGroup)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_GROUP))

    expect(getByPlaceholderText(GROUP.GROUP_ID[language])).toBeDisabled()
  })

  test('Functions correctly on PUT request', async () => {
    const { getAllByText, getByPlaceholderText, getByTestId, getByText } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_GROUP))
    await userEvent.type(getByPlaceholderText(GROUP.GROUP_ID[language]), alternativeTestGroupId)
    userEvent.click(getByText(returnRoles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]]))
    userEvent.click(getAllByText(GROUP.CREATE_GROUP[language])[1])

    expect(execute).toHaveBeenNthCalledWith(4, updatedTestGroup)
  })
})
