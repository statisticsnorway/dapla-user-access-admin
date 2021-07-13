import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App from '../App'
import { AppContextProvider } from '../context/AppContext'
import { APP, TEST_CONFIGURATIONS } from '../configurations'

jest.mock('../components/AppMenu', () => () => null)
jest.mock('../components/AppSettings', () => () => null)
jest.mock('../components/roles/AppRoles', () => () => null)
jest.mock('../components/users/AppUsers', () => () => null)
jest.mock('../components/roles/UpdateRole', () => () => null)
jest.mock('../components/users/UpdateUser', () => () => null)
jest.mock('../components/groups/AppGroups', () => () => null)
jest.mock('../components/groups/UpdateGroup', () => () => null)

const { language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByText }
}

test('Does not crash', () => {
  const { getByText } = setup()

  APP.forEach(step => {
    expect(getByText(step.title[language])).toBeInTheDocument()
    expect(getByText(step.description[language])).toBeInTheDocument()
  })
})
