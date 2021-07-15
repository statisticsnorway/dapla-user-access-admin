import { AUTH_API } from './API'

const addOption = path => ({
  key: path,
  text: path,
  value: path,
  state: '—',
  valuation: '—',
  incatalog: 'false',
  date: '—'
})

export const checkIncludesExcludes = (list, property) => {
  const returnList = { favors: AUTH_API.INCLUDES, only: '', list: {} }

  let includes = 0
  let excludes = 0

  for (const element in property) {
    let decision = false

    if (list === undefined) {
      decision = true
      returnList.list[element] = true
    } else {
      if (!list.hasOwnProperty(AUTH_API.INCLUDES)) {
        decision = true
        returnList.list[element] = true
      } else {
        if (list[AUTH_API.INCLUDES].includes(element)) {
          decision = true
          returnList.list[element] = true
        } else {
          returnList.list[element] = false
        }
      }

      if (list.hasOwnProperty(AUTH_API.EXCLUDES)) {
        if (list[AUTH_API.EXCLUDES].includes(element)) {
          returnList.list[element] = false
        }
      }
    }

    decision ? includes++ : excludes++
  }

  if (includes < excludes) {
    returnList.favors = AUTH_API.EXCLUDES
  }

  if (includes === 0) {
    returnList.only = AUTH_API.EXCLUDES
  }

  if (excludes === 0) {
    returnList.only = AUTH_API.INCLUDES
  }

  return returnList
}

export const moveIncludesExcludes = (includes, excludes, value, to) => {
  let returnIncludes
  let returnExcludes

  if (to === AUTH_API.INCLUDES) {
    returnExcludes = excludes.filter(excl => excl !== value)
    returnIncludes = includes.slice(0, includes.length)
    returnIncludes.push(value)
  } else {
    returnIncludes = includes.filter(inc => inc !== value)
    returnExcludes = excludes.slice(0, excludes.length)
    returnExcludes.push(value)
  }

  return { [AUTH_API.INCLUDES]: returnIncludes, [AUTH_API.EXCLUDES]: returnExcludes }
}

export const emptyIncludesExcludes = (type) => ({
  [AUTH_API.INCLUDES]: [],
  [AUTH_API.EXCLUDES]: Object.keys(type)
})

export const setupPathOptions = (role, fetchedPaths) => {
  let includes = []
  let excludes = []

  if (role.hasOwnProperty(AUTH_API.ROLE_OBJECT.ARRAY[0])) {
    if (role[AUTH_API.ROLE_OBJECT.ARRAY[0]].hasOwnProperty(AUTH_API.INCLUDES)) {
      includes = role[AUTH_API.ROLE_OBJECT.ARRAY[0]][AUTH_API.INCLUDES].map(path => addOption(path))
    }

    if (role[AUTH_API.ROLE_OBJECT.ARRAY[0]].hasOwnProperty(AUTH_API.EXCLUDES)) {
      excludes = role[AUTH_API.ROLE_OBJECT.ARRAY[0]][AUTH_API.EXCLUDES].map(path => addOption(path))
    }

    let rolePaths = includes.concat(excludes)

    fetchedPaths.forEach(path => {
      rolePaths = rolePaths.filter(rolePath => path.id.path !== rolePath.value)
    })

    return rolePaths
  } else {
    return []
  }
}

export const setupPathValues = (role, includesOrExcludes) => {
  let returnValues = []

  if (role.hasOwnProperty(AUTH_API.ROLE_OBJECT.ARRAY[0])) {
    if (includesOrExcludes === AUTH_API.INCLUDES) {
      if (role[AUTH_API.ROLE_OBJECT.ARRAY[0]].hasOwnProperty(AUTH_API.INCLUDES)) {
        returnValues = role[AUTH_API.ROLE_OBJECT.ARRAY[0]][AUTH_API.INCLUDES].map(path => path)
      }
    }

    if (includesOrExcludes === AUTH_API.EXCLUDES) {
      if (role[AUTH_API.ROLE_OBJECT.ARRAY[0]].hasOwnProperty(AUTH_API.EXCLUDES)) {
        returnValues = role[AUTH_API.ROLE_OBJECT.ARRAY[0]][AUTH_API.EXCLUDES].map(path => path)
      }
    }
  }

  return returnValues
}

export const setupIncludesExcludes = (role, property, field) => {
  const list = {}
  const returnSetup = ({ [AUTH_API.INCLUDES]: [], [AUTH_API.EXCLUDES]: [] })

  for (const element in property) {
    list[element] = !(role[field].hasOwnProperty(AUTH_API.INCLUDES) && !role[field][AUTH_API.INCLUDES].includes(element))

    if (role[field].hasOwnProperty(AUTH_API.EXCLUDES) && role[field][AUTH_API.EXCLUDES].includes(element)) {
      list[element] = false
    }
  }

  for (const includes in list) {
    returnSetup[list[includes] ? AUTH_API.INCLUDES : AUTH_API.EXCLUDES].push(includes)
  }

  return returnSetup
}
