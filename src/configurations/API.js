export const API = {
  ERROR_PATH: ['response', 'data'],
  GET_HEALTH: '/health'
}

export const CATALOG_API = {
  CATALOGS: 'catalogs',
  GET_CATALOGS: '/catalog'
}

export const AUTH_API = {
  ENUMS: {
    PRIVILEGES: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    STATES: ['RAW', 'INPUT', 'PROCESSED', 'OUTPUT', 'PRODUCT', 'OTHER'],
    VALUATIONS: ['OPEN', 'INTERNAL', 'SHIELDED', 'SENSITIVE']
  },
  EXCLUDES: 'excludes',
  GET_ACCESS: (path, privilege, state, maxValuation, userId) =>
    `/access/${userId}?privilege=${privilege}&namespace=${path}&valuation=${maxValuation}&state=${state}`,
  GET_GROUP: (groupId) => `/group/${groupId}`,
  GET_GROUPS: '/group',
  GET_ROLE: (roleId) => `/role/${roleId}`,
  GET_ROLES: '/role',
  GET_USER: (userId) => `/user/${userId}`,
  GROUP_OBJECT: {
    LIST: 'roles',
    STRING: ['groupId', 'description']
  },
  GROUPS: 'groups',
  INCLUDES: 'includes',
  PUT_GROUP: (groupId) => `/group/${groupId}`,
  PUT_ROLE: (roleId) => `/role/${roleId}`,
  PUT_USER: (userId) => `/user/${userId}`,
  ROLE_OBJECT: {
    ARRAY: ['privileges', 'states'],
    ENUM: 'maxValuation',
    LIST: 'paths',
    STRING: ['roleId', 'description']
  },
  ROLES: 'roles',
  USER_OBJECT: {
    ARRAY: ['groups', 'roles'],
    STRING: 'userId'
  }
}
