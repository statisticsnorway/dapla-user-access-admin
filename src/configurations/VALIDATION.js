import { AUTH_API } from './API'
import { GROUPS, ROLES, USERS, VALUATION } from '../enums'

export const validateUser = (user, language) => {
  const isValid = { isValid: true, reason: {} }

  if (user[AUTH_API.USER_OBJECT.STRING] === undefined || user[AUTH_API.USER_OBJECT.STRING].trim() === '') {
    isValid.isValid = false
    isValid.reason[AUTH_API.USER_OBJECT.STRING] = USERS.INVALID(AUTH_API.USER_OBJECT.STRING, language)
  }

  if (user[AUTH_API.USER_OBJECT.ARRAY[0]] === undefined || user[AUTH_API.USER_OBJECT.ARRAY[0]].length === 0) {
    isValid.isValid = false
    isValid.reason[AUTH_API.USER_OBJECT.ARRAY[0]] = USERS.INVALID(AUTH_API.USER_OBJECT.ARRAY[0], language)
  }

  if (user[AUTH_API.USER_OBJECT.ARRAY[1]] === undefined || user[AUTH_API.USER_OBJECT.ARRAY[1]].length === 0) {
    isValid.isValid = false
    isValid.reason[AUTH_API.USER_OBJECT.ARRAY[1]] = USERS.INVALID(AUTH_API.USER_OBJECT.ARRAY[1], language)
  }

  return isValid
}

export const validateGroup = (group, language) => {
  const isValid = { isValid: true, reason: {} }

  if (group[AUTH_API.GROUP_OBJECT.STRING[0]] === undefined || group[AUTH_API.GROUP_OBJECT.STRING[0]].trim() === '') {
    isValid.isValid = false
    isValid.reason[AUTH_API.GROUP_OBJECT.STRING[0]] = GROUPS.INVALID(AUTH_API.GROUP_OBJECT.STRING[0], language)
  }

  if (group[AUTH_API.GROUP_OBJECT.STRING[1]] === undefined || group[AUTH_API.GROUP_OBJECT.STRING[1]].trim() === '') {
    isValid.isValid = false
    isValid.reason[AUTH_API.GROUP_OBJECT.STRING[1]] = GROUPS.INVALID(AUTH_API.GROUP_OBJECT.STRING[1], language)
  }

  if (group[AUTH_API.GROUP_OBJECT.ARRAY] === undefined || group[AUTH_API.GROUP_OBJECT.ARRAY].length === 0) {
    isValid.isValid = false
    isValid.reason[AUTH_API.GROUP_OBJECT.ARRAY] = GROUPS.INVALID(AUTH_API.GROUP_OBJECT.ARRAY, language)
  }

  return isValid
}

export const validateRole = (role, catalogOptions, language) => {
  const isValid = { isValid: true, reason: {} }

  if (role[AUTH_API.ROLE_OBJECT.STRING[0]] === undefined || role[AUTH_API.ROLE_OBJECT.STRING[0]].trim() === '') {
    isValid.isValid = false
    isValid.reason[AUTH_API.ROLE_OBJECT.STRING[0]] = ROLES.INVALID(AUTH_API.ROLE_OBJECT.STRING[0], language)
  }

  if (role[AUTH_API.ROLE_OBJECT.STRING[1]] === undefined || role[AUTH_API.ROLE_OBJECT.STRING[1]].trim() === '') {
    isValid.isValid = false
    isValid.reason[AUTH_API.ROLE_OBJECT.STRING[1]] = ROLES.INVALID(AUTH_API.ROLE_OBJECT.STRING[1], language)
  }

  if (role[AUTH_API.ROLE_OBJECT.ARRAY[1]][AUTH_API.INCLUDES].length === 0) {
    isValid.isValid = false
    isValid.reason[AUTH_API.ROLE_OBJECT.ARRAY[1]] = ROLES.INVALID(AUTH_API.ROLE_OBJECT.ARRAY[1], language)
  }

  if (role[AUTH_API.ROLE_OBJECT.ARRAY[2]][AUTH_API.INCLUDES].length === 0) {
    isValid.isValid = false
    isValid.reason[AUTH_API.ROLE_OBJECT.ARRAY[2]] = ROLES.INVALID(AUTH_API.ROLE_OBJECT.ARRAY[2], language)
  }

  if (role[AUTH_API.ROLE_OBJECT.ARRAY[0]][AUTH_API.INCLUDES].length === 0) {
    isValid.isValid = false
    isValid.reason[AUTH_API.ROLE_OBJECT.ARRAY[0]] = ROLES.INVALID(AUTH_API.ROLE_OBJECT.ARRAY[0], language)
  }

  if (role[AUTH_API.ROLE_OBJECT.ENUM] === undefined || role[AUTH_API.ROLE_OBJECT.ENUM] === '') {
    isValid.isValid = false
    isValid.reason[AUTH_API.ROLE_OBJECT.ENUM] = ROLES.INVALID(AUTH_API.ROLE_OBJECT.ENUM, language)
  }

  const pathValuations = catalogOptions.filter(({ id }) => role[AUTH_API.ROLE_OBJECT.ARRAY[0]][AUTH_API.INCLUDES].includes(id.path)).map(({ valuation }) => valuation)
  const catalogScore = Object.keys(VALUATION).filter(element => element !== 'UNRECOGNIZED').reduce((acc, cur, curi) => {
    if (pathValuations.includes(cur)) {
      acc = curi
    }

    return acc
  }, 0)
  const valuationScore = Object.keys(VALUATION).filter(element => element !== 'UNRECOGNIZED').reduce((acc, cur, curi) => {
    if (role[AUTH_API.ROLE_OBJECT.ENUM] === cur) {
      acc = curi
    }

    return acc
  }, 0)

  if (valuationScore < catalogScore) {
    isValid.isValid = false
    isValid.reason[AUTH_API.ROLE_OBJECT.ENUM] = ROLES.INVALID('tooLowValuationScore', language)
  }

  const pathStates = catalogOptions.filter(({ id }) => role[AUTH_API.ROLE_OBJECT.ARRAY[0]][AUTH_API.INCLUDES].includes(id.path)).map(({ state }) => state)
  const statesScore = pathStates.filter(element => !role[AUTH_API.ROLE_OBJECT.ARRAY[2]][AUTH_API.INCLUDES].includes(element))

  if (statesScore.length !== 0) {
    isValid.isValid = false
    isValid.reason[AUTH_API.ROLE_OBJECT.ARRAY[2]] = ROLES.INVALID('tooLowStatesScore', language)
  }

  return isValid
}
