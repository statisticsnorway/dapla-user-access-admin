export const API = {
  ERROR_PATH: ['response', 'data'],
  ENUMS: {
    PRIVILEGES: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    STATES: ['RAW', 'INPUT', 'PROCESSED', 'OUTPUT', 'PRODUCT', 'OTHER'],
    VALUATIONS: ['OPEN', 'INTERNAL', 'SHIELDED', 'SENSITIVE']
  },
  GET_ACCESS: (namespace, privilege, state, maxValuation, userId) =>
    `/access/${userId}?privilege=${privilege}&namespace=${namespace}&valuation=${maxValuation}&state=${state}`,
  GET_HEALTH: '/health',
  GET_ROLE: (roleId) => `/role/${roleId}`,
  GET_ROLES: '/role',
  GET_CATALOGS: '/catalog',
  GET_USER: (userId) => `/user/${userId}`,
  PUT_ROLE: (roleId) => `/role/${roleId}`,
  PUT_USER: (userId) => `/user/${userId}`,
  ROLES: 'roles',
  CATALOGS: 'catalogs',
  TEMP_DATASETS: ['/skatt/person/rawdata-2019', '/ske/sirius-person-utkast/2018v19']
}
