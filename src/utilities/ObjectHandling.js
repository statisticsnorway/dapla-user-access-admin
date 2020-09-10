import { AUTH_API } from '../configurations'

export const convertToIncludesExcludes = (object, type) => {
  if (!object || (!object.hasOwnProperty(AUTH_API.INCLUDES) && !object.hasOwnProperty(AUTH_API.EXCLUDES))) {
    return { [AUTH_API.INCLUDES]: AUTH_API.ENUMS[type].map(value => value), [AUTH_API.EXCLUDES]: [] }
  } else if (object.hasOwnProperty(AUTH_API.INCLUDES) && !object.hasOwnProperty(AUTH_API.EXCLUDES)) {
    return {
      [AUTH_API.EXCLUDES]: AUTH_API.ENUMS[type].filter(inc => !object[AUTH_API.INCLUDES].includes(inc)),
      ...object
    }
  } else if (!object.hasOwnProperty(AUTH_API.INCLUDES) && object.hasOwnProperty(AUTH_API.EXCLUDES)) {
    return {
      [AUTH_API.INCLUDES]: AUTH_API.ENUMS[type].filter(exc => !object[AUTH_API.EXCLUDES].includes(exc)),
      ...object
    }
  } else {
    return object
  }
}

export const moveIncludesExcludes = (includes, excludes, value, to) => {
  let returnIncludes
  let returExcludes

  if (to === AUTH_API.INCLUDES) {
    returExcludes = excludes.filter(excl => excl !== value)
    returnIncludes = includes.slice(0, includes.length)
    returnIncludes.push(value)
  } else {
    returnIncludes = includes.filter(inc => inc !== value)
    returExcludes = excludes.slice(0, excludes.length)
    returExcludes.push(value)
  }

  return { [AUTH_API.INCLUDES]: returnIncludes, [AUTH_API.EXCLUDES]: returExcludes }
}

export const setupPathOptions = role => {
  let includes = []
  let excludes = []

  if (role.hasOwnProperty(AUTH_API.ROLE_OBJECT.LIST)) {
    if (role[AUTH_API.ROLE_OBJECT.LIST].hasOwnProperty(AUTH_API.INCLUDES)) {
      includes = role[AUTH_API.ROLE_OBJECT.LIST][AUTH_API.INCLUDES].map(path => ({
        key: path,
        text: path,
        value: path
      }))
    }

    if (role[AUTH_API.ROLE_OBJECT.LIST].hasOwnProperty(AUTH_API.EXCLUDES)) {
      excludes = role[AUTH_API.ROLE_OBJECT.LIST][AUTH_API.EXCLUDES].map(path => ({
        key: path,
        text: path,
        value: path
      }))
    }

    return includes.concat(excludes)
  } else {
    return []
  }
}

const compareObjects = (by, direction) => {
  return function innerSort (a, b) {
    let aObj = a
    let bObj = b
    const byArray = by[0].split('.')

    for (let idx = 0; idx < byArray.length; idx++) {
      aObj = aObj[byArray[idx]]
      bObj = bObj[byArray[idx]]
    }

    return direction === 'ascending' ? aObj.localeCompare(bObj) : bObj.localeCompare(aObj)
  }
}

export const sortArrayOfObjects = (array, by, direction = 'ascending') => {
  return array && array[1] && by && by.length === 1 ? array.sort(compareObjects(by, direction)) : array
}
