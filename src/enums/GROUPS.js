import { AUTH_API } from '../configurations'

export const GROUPS = {
  CREATE_GROUP: {
    en: 'Create group',
    nb: 'Opprett gruppe'
  },
  DESCRIPTION: {
    en: 'Description',
    nb: 'Beskrivelse'
  },
  GROUP_ID: {
    en: 'Group id',
    nb: 'Gruppe-id'
  },
  ROLES: {
    en: 'Roles',
    nb: 'Roller'
  },
  ROLES_FETCH_ERROR: {
    en: 'Could not fetch roles',
    nb: 'Kunne ikke hente roller'
  },
  UPDATE_GROUP: {
    en: 'Update group',
    nb: 'Oppdater gruppe'
  },
  NO_OF_GROUPS: {
    en: 'Number of groups',
    nb: 'Antall grupper'
  },
  GROUP_NO_DESCRIPTION: {
    en: 'Groups without description',
    nb: 'Grupper uten beskrivelse'
  },
  GROUP_NO_ROLE: {
    en: 'Groups without a role',
    nb: 'Grupper uten roller'
  },
  GROUPS_PER_ROLE: {
    en: 'Groups per role',
    nb: 'Grupper per rolle'
  },
  INVALID: (property, language) => {
    switch (property) {
      case AUTH_API.GROUP_OBJECT.STRING[0]:
        return {
          en: 'Invalid group id',
          nb: 'Ugyldig gruppe-id'
        }[language]

      case AUTH_API.GROUP_OBJECT.STRING[1]:
        return {
          en: 'Must have a description',
          nb: 'Må ha en beskrivelse'
        }[language]

      case AUTH_API.GROUP_OBJECT.ARRAY:
        return {
          en: 'Must have at least one role',
          nb: 'Må ha minst en rolle'
        }[language]

      default:
        return 'Error'
    }
  }
}
