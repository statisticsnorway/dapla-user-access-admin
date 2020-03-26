export const API = {
  CATALOGS: 'catalogs',
  ERROR_PATH: ['response', 'data'],
  ENUMS: {
    PRIVILEGES: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    STATES: ['RAW', 'INPUT', 'PROCESSED', 'OUTPUT', 'PRODUCT', 'OTHER'],
    VALUATIONS: ['OPEN', 'INTERNAL', 'SHIELDED', 'SENSITIVE']
  },
  GET_ACCESS: (namespace, privilege, state, maxValuation, userId) =>
    `/access/${userId}?privilege=${privilege}&namespace=${namespace}&valuation=${maxValuation}&state=${state}`,
  GET_CATALOGS: '/catalog',
  GET_HEALTH: '/health',
  GET_ROLE: (roleId) => `/role/${roleId}`,
  GET_ROLES: '/role',
  GET_USER: (userId) => `/user/${userId}`,
  PUT_ROLE: (roleId) => `/role/${roleId}`,
  PUT_USER: (userId) => `/user/${userId}`,
  ROLES: 'roles'
}
