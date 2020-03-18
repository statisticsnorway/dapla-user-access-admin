export const API = {
  ERROR_PATH: ['response', 'data'],
  GET_ACCESS: (namespace, privilege, state, valuation, user) =>
    `/access/${user}?privilege=${privilege}&namespace=${namespace}&valuation=${valuation}&state=${state}`,
  GET_HEALTH: '/health',
  GET_USER: (user) => `/user/${user}`,
  PRIVILEGES: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
  ROLES: 'roles',
  STATES: ['RAW', 'INPUT', 'PROCESSED', 'OUTPUT', 'PRODUCT', 'OTHER'],
  TEMP_DATASETS: ['/skatt/person/rawdata-2019', '/ske/sirius-person-utkast/2018v19'],
  VALUATIONS: ['OPEN', 'INTERNAL', 'SHIELDED', 'SENSITIVE']
}
