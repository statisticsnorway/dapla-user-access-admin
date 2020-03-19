export const API = {
  ERROR_PATH: ['response', 'data'],
  GET_ACCESS: (namespace, privilege, state, valuation, userId) =>
    `/access/${userId}?privilege=${privilege}&namespace=${namespace}&valuation=${valuation}&state=${state}`,
  GET_HEALTH: '/health',
  GET_ROLE: (roleId) => `/role/${roleId}`,
  GET_USER: (userId) => `/user/${userId}`,
  PRIVILEGES: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
  PUT_USER: (userId) => `/user/${userId}`,
  ROLES: 'roles',
  STATES: ['RAW', 'INPUT', 'PROCESSED', 'OUTPUT', 'PRODUCT', 'OTHER'],
  TEMP_DATASETS: ['/skatt/person/rawdata-2019', '/ske/sirius-person-utkast/2018v19'],
  TEMP_ROLES: ['tmp.public', 'raw_ro', 'ske.rawdata', 'skatt.person.rawdata', 'skatt.person.inndata'],
  VALUATIONS: ['OPEN', 'INTERNAL', 'SHIELDED', 'SENSITIVE']
}
