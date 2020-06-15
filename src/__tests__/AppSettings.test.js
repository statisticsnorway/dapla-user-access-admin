import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AppSettings } from '../components'
import { ApiContext, LanguageContext } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

const { alternativeUrl, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppSettings authError={null} catalogError={null} loading={false} open={true} setSettingsOpen={jest.fn()} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

test('Renders correctly', () => {
  const { getByPlaceholderText } = setup()

  expect(getByPlaceholderText(SETTINGS.AUTH_API[language])).toHaveValue(apiContext.authApi)
  expect(getByPlaceholderText(SETTINGS.CATALOG_API[language])).toHaveValue(apiContext.catalogApi)
})

test('Editing works correctly', async () => {
  const { getByPlaceholderText, getByText } = setup()

  await userEvent.type(getByPlaceholderText(SETTINGS.AUTH_API[language]), alternativeUrl)
  await userEvent.type(getByPlaceholderText(SETTINGS.CATALOG_API[language]), alternativeUrl)

  expect(getByText(SETTINGS.EDITED_VALUES[language])).toBeInTheDocument()

  userEvent.click(getByText(SETTINGS.APPLY[language]))

  expect(apiContext.setAuthApi).toHaveBeenCalled()
  expect(apiContext.setCatalogApi).toHaveBeenCalled()
})

test('Resetting to default values works correctly', async () => {
  const { getByPlaceholderText, getByTestId } = setup()

  await userEvent.type(getByPlaceholderText(SETTINGS.AUTH_API[language]), alternativeUrl)
  await userEvent.type(getByPlaceholderText(SETTINGS.CATALOG_API[language]), alternativeUrl)

  userEvent.click(getByTestId(TEST_IDS.DEFAULT_SETTINGS_BUTTON))

  // There is a bug in https://github.com/statisticsnorway/ssb-component-library preventing values from updating when updated from another source then itself
  //expect(getByPlaceholderText(SETTINGS.AUTH_API[language])).toHaveValue(api.authApi)
  //expect(getByPlaceholderText(SETTINGS.CATALOG_API[language])).toHaveValue(api.catalogApi)
  expect(apiContext.setAuthApi).toHaveBeenCalledWith(apiContext.authApi)
  expect(apiContext.setCatalogApi).toHaveBeenCalledWith(apiContext.catalogApi)
})
