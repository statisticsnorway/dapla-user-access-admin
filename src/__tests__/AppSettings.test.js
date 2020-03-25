import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AppSettings } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { SETTINGS, TEST_IDS } from '../enums'
import { TEST_CONFIGURATIONS } from '../setupTests'

const { alternativeUrl, apiContext, language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppSettings authError={null} loading={false} open={true} setSettingsOpen={jest.fn()} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

test('Renders correctly', () => {
  const { getByPlaceholderText } = setup()

  expect(getByPlaceholderText(SETTINGS.AUTH_API[language])).toHaveValue(apiContext.authApi)
})

test('Editing works correctly', () => {
  const { getByPlaceholderText, getByText } = setup()

  userEvent.type(getByPlaceholderText(SETTINGS.AUTH_API[language]), alternativeUrl)

  expect(getByText(SETTINGS.EDITED_VALUES[language])).toBeInTheDocument()

  userEvent.click(getByText(SETTINGS.APPLY[language]))

  expect(apiContext.setAuthApi).toHaveBeenCalled()
})

test('Resetting to default values works correctly', () => {
  const { getByPlaceholderText, getByTestId } = setup()

  userEvent.type(getByPlaceholderText(SETTINGS.AUTH_API[language]), alternativeUrl)

  userEvent.click(getByTestId(TEST_IDS.DEFAULT_SETTINGS_BUTTON))

  // There is a bug in https://github.com/statisticsnorway/ssb-component-library preventing values from updating when updated from another source then itself
  //expect(getByPlaceholderText(SETTINGS.AUTH_API[language])).toHaveValue(api.authApi)
  expect(apiContext.setAuthApi).toHaveBeenCalledWith(apiContext.authApi)
})
