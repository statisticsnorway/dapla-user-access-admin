export const API = {
  GET_HEALTH: '/health'
}

export const AUTH_API = {
  ENUMS: {
    PRIVILEGES: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'DEPSEUDO'],
    STATES: ['RAW', 'INPUT', 'PROCESSED', 'OUTPUT', 'PRODUCT', 'OTHER', 'TEMP'],
    VALUATIONS: ['OPEN', 'INTERNAL', 'SHIELDED', 'SENSITIVE']
  },
  EXCLUDES: 'excludes',
  GET_ACCESS: (path, privilege, state, maxValuation, userId) =>
    `/access/${userId}?privilege=${privilege}&path=${path}&valuation=${maxValuation}&state=${state}`,
  GET_GROUPS: '/group',
  GET_ROLE: (roleId) => `/role/${roleId}`,
  GET_ROLES: '/role',
  GROUP_OBJECT: {
    LIST: 'roles',
    STRING: ['groupId', 'description']
  },
  GET_USERS: '/user',
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
  },
  USERS: 'users'
}

export const CATALOG_API = {
  CATALOGS: 'catalogs',
  CATALOG_OBJECT: {
    ENUM: ['valuation', 'state', 'type'],
    OBJECT: {
      NAME: 'id',
      STRING: ['path', 'timestamp']
    },
    STRING: ['parentUri']
  },
  GET_CATALOGS: '/catalog'
}

export const checkAccess = (data, value) => {
  let positive = false

  try {
    if (data && (data.hasOwnProperty(AUTH_API.INCLUDES) || data.hasOwnProperty(AUTH_API.EXCLUDES))) {
      if (data.hasOwnProperty(AUTH_API.INCLUDES)) {
        positive = data[AUTH_API.INCLUDES].includes(value)
      }

      if (data.hasOwnProperty(AUTH_API.EXCLUDES)) {
        positive = !data[AUTH_API.EXCLUDES].includes(value)
      }
    } else {
      positive = true
    }
  } catch (error) {
    console.log(error)
  }

  return positive
}
