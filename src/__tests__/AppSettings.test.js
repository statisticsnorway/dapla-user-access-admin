import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { AppSettings } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { alternativeApi, errorString, errorResponse, errorObject, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn(), jest.fn(), jest.fn(), jest.fn())
const execute = jest.fn()

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText, getAllByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppSettings open={true} setOpen={jest.fn()} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText, getAllByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ error: undefined, loading: false }, execute])
  })

  test('Renders correctly', () => {
    const { getByPlaceholderText } = setup()

    expect(getByPlaceholderText(SETTINGS.AUTH_API[language])).toHaveValue(apiContext.authApi)
  })

  test('Pressing enter in input fires api call', () => {
    const { getByPlaceholderText } = setup()

    userEvent.type(getByPlaceholderText(SETTINGS.AUTH_API[language]), '{enter}')
    userEvent.type(getByPlaceholderText(SETTINGS.CATALOG_API[language]), '{enter}')

    expect(apiContext.setAuthApi).toHaveBeenCalledTimes(2)
    expect(apiContext.setCatalogApi).toHaveBeenCalledTimes(2)
  })

  test('Editing values works correctly', () => {
    const { getByPlaceholderText, getByText } = setup()

    userEvent.type(getByPlaceholderText(SETTINGS.CATALOG_API[language]), alternativeApi)

    expect(getByText(SETTINGS.EDITED_VALUES[language])).toBeInTheDocument()

    userEvent.click(getByText(SETTINGS.APPLY[language]))

    expect(apiContext.setCatalogApi).toHaveBeenCalled()
  })

  test('Resetting to default values works correctly', () => {
    const { getByPlaceholderText, getByTestId } = setup()

    userEvent.type(getByPlaceholderText(SETTINGS.AUTH_API[language]), alternativeApi)

    userEvent.click(getByTestId(TEST_IDS.DEFAULT_SETTINGS_VALUES_BUTTON))

    expect(getByPlaceholderText(SETTINGS.AUTH_API[language])).toHaveValue(apiContext.authApi)
  })

  test('Toggles modal', () => {
    setup()

    userEvent.keyboard('{esc}')
  })
})

test('Shows error when there is a problem', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, execute])

  const { getAllByText } = setup()

  expect(getAllByText(errorString)).toHaveLength(2)
})

test('Shows error when there is a problem with the API', () => {
  useAxios.mockReturnValue([{ error: errorResponse, loading: false }, execute])

  const { getAllByText } = setup()

  expect(getAllByText(errorResponse.response.data)).toHaveLength(2)
})

test('Shows error when there is a problem with the API call', () => {
  useAxios.mockReturnValue([{ error: errorObject, loading: false }, execute])

  const { getAllByText } = setup()

  expect(getAllByText(errorObject.response.statusText)).toHaveLength(2)
})
