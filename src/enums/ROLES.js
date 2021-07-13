import { AUTH_API } from '../configurations'

export const ROLES = {
  CREATE_ROLE: {
    en: 'Create role',
    nb: 'Opprett rolle'
  },
  DESCRIPTION: {
    en: 'Description',
    nb: 'Beskrivelse'
  },
  MAX_VALUATION: {
    en: 'Valuation',
    nb: 'Verdivurdering'
  },
  PATHS: {
    en: 'Paths',
    nb: 'Stier'
  },
  PATHS_INCLUDE: {
    en: 'Included paths',
    nb: 'Inkluderte stier'
  },
  PATHS_EXCLUDE: {
    en: 'Excluded paths',
    nb: 'Ekskluderte stier'
  },
  PATHS_FETCH_ERROR: {
    en: 'Could not fetch paths',
    nb: 'Kunne ikke hente stier'
  },
  PRIVILEGES: {
    en: 'Privileges',
    nb: 'Privilegier'
  },
  ROLE_ID: {
    en: 'Role id',
    nb: 'Rolle-id'
  },
  STATES: {
    en: 'States',
    nb: 'Tilstander'
  },
  STATE: {
    en: 'State',
    nb: 'Tilstand'
  },
  UPDATE_ROLE: {
    en: 'Update role',
    nb: 'Oppdater rolle'
  },
  NO_OF_ROLES: {
    en: 'Number of roles',
    nb: 'Antall roller'
  },
  ROLE_NO_DESCRIPTION: {
    en: 'Roles without description',
    nb: 'Roller uten beskrivelse'
  },
  SIMPLE_VIEW: {
    en: 'Simplified privilege/state view?',
    nb: 'Forenklet privilegie-/tilstandsvisning?'
  },
  FILTER_USER_ROLES: {
    en: 'Remove pure user roles from table?',
    nb: 'Fjern rene brukerroller fra tabellen?'
  },
  INVALID: (property, language) => {
    switch (property) {
      case AUTH_API.ROLE_OBJECT.STRING[0]:
        return {
          en: 'Invalid role id',
          nb: 'Ugyldig rolle-id'
        }[language]

      case AUTH_API.ROLE_OBJECT.STRING[1]:
        return {
          en: 'Must have a description',
          nb: 'Må ha en beskrivelse'
        }[language]

      case AUTH_API.ROLE_OBJECT.ARRAY[0]:
        return {
          en: 'Must have at least one valid path',
          nb: 'Må ha minst en gyldig sti'
        }[language]

      case AUTH_API.ROLE_OBJECT.ARRAY[1]:
        return {
          en: 'Must have at least one allowed privilege',
          nb: 'Må ha minst ett tillatt privilegie'
        }[language]

      case AUTH_API.ROLE_OBJECT.ARRAY[2]:
        return {
          en: 'Must have at least one allowed state',
          nb: 'Må ha minst en tillatt tilstand'
        }[language]

      case AUTH_API.ROLE_OBJECT.ENUM:
        return {
          en: 'Must choose a valuation',
          nb: 'Må velge en verdivurdering'
        }[language]

      case 'tooLowValuationScore':
        return {
          en: 'Must choose a higher valuation for current included paths',
          nb: 'Må velge en høyere verdivurdering for valgte inkluderte stier'
        }[language]

      case 'tooLowStatesScore':
        return {
          en: 'Missing state for current included paths',
          nb: 'Mangler tilstand for valgte inkluderte stier'
        }[language]

      default:
        return 'Error'
    }
  }
}
