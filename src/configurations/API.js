export const API = {
  AUTH: 'auth',
  CATALOG: 'catalog',
  GET_HEALTH: '/health',
  HANDLE_PUT: (env, data, url, token) => {
    if (env === 'development') {
      return ({
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: data,
        url: url
      })
    } else {
      return ({
        data: data,
        url: url
      })
    }
  }
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
  ROLE_OBJECT: {
    ARRAY: ['paths', 'privileges', 'states'],
    ENUM: 'maxValuation',
    STRING: ['roleId', 'description']
  },
  ROLES: 'roles',
  NO_GROUP: 'NO_GROUP',
  NO_ROLE: 'NO_ROLE',
  INCLUDES: 'includes',
  EXCLUDES: 'excludes'
}

export const CATALOG_API = {
  CATALOGS: 'catalogs',
  GET_PATHS: '/catalog'
}
