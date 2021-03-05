import '@testing-library/jest-dom/extend-expect'

jest.mock('axios-hooks')

window.__ENV = {
  REACT_APP_API_AUTH: process.env.REACT_APP_API_AUTH,
  REACT_APP_API_CATALOG: process.env.REACT_APP_API_CATALOG
}
