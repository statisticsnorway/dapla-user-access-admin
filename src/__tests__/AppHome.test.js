import React from 'react'
import { render } from '@testing-library/react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'

import { AppHome } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, UI } from '../enums'

const { alternativeTestUserId, apiContext, language, refetch } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppHome />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: null }, refetch])

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(UI.USER[language])).toBeInTheDocument()
  })

  test('Changing user works correctly', () => {
    const { getByPlaceholderText, getByTestId } = setup()

    userEvent.type(getByPlaceholderText(UI.USER[language]), alternativeTestUserId)
    userEvent.click(getByTestId(TEST_IDS.REFRESH_USER))

    expect(refetch).toHaveBeenCalled()
  })
})
