import { AUTH_API } from '../configurations'

export const USERS = {
  CREATE_USER: {
    en: 'Create a new user',
    nb: 'Opprett ny bruker'
  },
  GROUPS: {
    en: 'Groups',
    nb: 'Grupper'
  },
  ROLES: {
    en: 'Roles',
    nb: 'Roller'
  },
  ROLES_FETCH_ERROR: {
    en: 'Could not fetch roles',
    nb: 'Kunne ikke hente roller'
  },
  GROUPS_FETCH_ERROR: {
    en: 'Could not fetch groups',
    nb: 'Kunne ikke hente grupper'
  },
  UPDATE_USER: {
    en: 'Update user',
    nb: 'Oppdater bruker'
  },
  USER_ID: {
    en: 'User id',
    nb: 'Bruker-id'
  },
  NO_OF_USERS: {
    en: 'Number of users',
    nb: 'Antall brukere'
  },
  USERS_NO_GROUP: {
    en: 'Users without a group',
    nb: 'Brukere uten gruppe'
  },
  USERS_NO_ROLE: {
    en: 'Users without a role',
    nb: 'Brukere uten rolle'
  },
  USERS_PER_GROUP: {
    en: 'Users per group',
    nb: 'Brukere per gruppe'
  },
  USERS_PER_ROLE: {
    en: 'Users per role (not including \'user.\'-roles)',
    nb: 'Brukere per rolle (utenom \'user.\'-roller)'
  },
  INVALID: (property, language) => {
    switch (property) {
      case AUTH_API.USER_OBJECT.STRING:
        return {
          en: 'Invalid user id',
          nb: 'Ugyldig bruker-id'
        }[language]

      case AUTH_API.USER_OBJECT.ARRAY[0]:
        return {
          en: 'Must belong to at least one group',
          nb: 'Må tilhøre minst en gruppe'
        }[language]

      case AUTH_API.USER_OBJECT.ARRAY[1]:
        return {
          en: 'Must have at least one role',
          nb: 'Må ha minst en rolle'
        }[language]

      default:
        return 'Error'
    }
  }
}
