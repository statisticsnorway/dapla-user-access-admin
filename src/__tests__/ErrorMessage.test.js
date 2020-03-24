import React from 'react'
import { render } from '@testing-library/react'

import ErrorMessage from '../components/ErrorMessage'
import { TEST_CONFIGURATIONS } from '../configurations'
import { AppContextProvider } from '../utilities'

const { errorString, objectString } = TEST_CONFIGURATIONS

const setup = error => {
  const { getByText } = render(
    <AppContextProvider>
      <ErrorMessage error={error} />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders string errors', () => {
  const { getByText } = setup(errorString)

  expect(getByText(errorString)).toBeInTheDocument()
})

test('Renders object errors when object traverse is possible', () => {
  const errorObject = { response: { data: errorString } }
  const { getByText } = setup(errorObject)

  expect(getByText(errorString)).toBeInTheDocument()
})

test('Renders fallback error when object traverse is impossible', () => {
  const errorObject = { not: { correct: errorString } }
  const { getByText } = setup(errorObject)

  expect(getByText(objectString)).toBeInTheDocument()
})
