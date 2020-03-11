import React from 'react'
import { render } from '@testing-library/react'

import ErrorMessage from '../components/ErrorMessage'
import { AppContextProvider } from '../utilities'

const stringError = 'A problem occured'
const setup = error => {
  const { getByText } = render(
    <AppContextProvider>
      <ErrorMessage error={error} />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders string errors', () => {
  const { getByText } = setup(stringError)

  expect(getByText(stringError)).toBeInTheDocument()
})

test('Renders object errors when object traverse is possible', () => {
  const objectError = { response: { data: stringError } }
  const { getByText } = setup(objectError)

  expect(getByText(stringError)).toBeInTheDocument()
})

test('Renders fallback error when object traverse is impossible', () => {
  const objectError = { not: { correct: stringError } }
  const { getByText } = setup(objectError)

  expect(getByText('[object Object]')).toBeInTheDocument()
})
