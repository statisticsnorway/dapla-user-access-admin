import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { UpdateGroup } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { AUTH_API, TEST_CONFIGURATIONS } from '../configurations'
import { GROUP, TEST_IDS } from '../enums'

import Roles from './test-data/Roles.json'
import TestGroup from './test-data/TestGroup.json'
import UpdatedTestGroup from './test-data/UpdatedTestGroup.json'

const { alternativeTestGroupDescription, alternativeTestGroupId, language, responseObject } = TEST_CONFIGURATIONS
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
    [{ data: Roles, loading: false, error: null, response: responseObject }, execute]
  )

  test('Renders correctly on new group', () => {
    const { getByPlaceholderText, getByTestId } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_GROUP))

    expect(getByPlaceholderText(GROUP.GROUP_ID[language])).toBeInTheDocument()
  })

  test('Renders correctly on update group', () => {
    const { getByPlaceholderText, getByTestId } = setup(false, TestGroup)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_GROUP))

    expect(getByPlaceholderText(GROUP.GROUP_ID[language])).toBeDisabled()
  })

  test('Functions correctly on PUT request', async () => {
    const { getAllByText, getByPlaceholderText, getByTestId, getByText } = setup(true)

    userEvent.click(getByTestId(TEST_IDS.UPDATE_GROUP))
    await userEvent.type(getByPlaceholderText(GROUP.GROUP_ID[language]), alternativeTestGroupId)
    await userEvent.type(getByPlaceholderText(GROUP.DESCRIPTION[language]), alternativeTestGroupDescription)
    userEvent.click(getByText(Roles[AUTH_API.ROLES][0][AUTH_API.ROLE_OBJECT.STRING[0]]))
    userEvent.click(getAllByText(GROUP.CREATE_GROUP[language])[1])

    /*
    There is a bug with userEvent.type in a TextArea from SemanticUI where it seems to take the first character and
    place it last in the string. Until this is fixed, the value for description in UpdatedTestGroup has to be a little
    bit jumbled. It works fine outside testing.
    */
    expect(execute).toHaveBeenNthCalledWith(4, UpdatedTestGroup)
  })
})
