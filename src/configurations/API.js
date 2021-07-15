export const API = {
  GET_HEALTH: '/health'
}

export const CATALOG_API = {
  CATALOGS: 'catalogs',
  GET_PATHS: '/catalog?limit=3000'
}

export const AUTH_API = {
  GET_USERS: '/user',
  PUT_USER: (userId) => `${AUTH_API.GET_USERS}/${userId}`,
  GET_GROUPS: '/group',
  PUT_GROUP: (groupId) => `${AUTH_API.GET_GROUPS}/${groupId}`,
  GET_ROLES: '/role',
  PUT_ROLE: (roleId) => `${AUTH_API.GET_ROLES}/${roleId}`,
  USERS: 'users',
  USER_OBJECT: {
    ARRAY: ['groups', 'roles'],
    STRING: 'userId'
  },
  GROUPS: 'groups',
  GROUP_OBJECT: {
    ARRAY: 'roles',
    STRING: ['groupId', 'description']
  },
  ROLES: 'roles',
  ROLE_OBJECT: {
    ARRAY: ['paths', 'privileges', 'states'],
    ENUM: 'maxValuation',
    STRING: ['roleId', 'description']
  },
  NO_GROUP: 'NO_GROUP',
  NO_ROLE: 'NO_ROLE',
  INCLUDES: 'includes',
  EXCLUDES: 'excludes'
}
