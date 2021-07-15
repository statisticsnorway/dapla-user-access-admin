import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

const COMMON_API = {
  ERROR_PATH: ['response', 'data'],
  ERROR_STATUS_PATH: ['response', 'statusText']
}

const compareObjects = (by, direction) => (a, b) => {
  let aObj = a
  let bObj = b
  const byArray = by[0].split('.')

  for (let idx = 0; idx < byArray.length; idx++) {
    aObj = aObj[byArray[idx]]
    bObj = bObj[byArray[idx]]
  }

  return direction === 'ascending' ? aObj.localeCompare(bObj) : bObj.localeCompare(aObj)
}

export const sortArrayOfObjects = (array, by, direction = 'ascending') =>
  array && array[1] && by && by.length === 1 ? array.sort(compareObjects(by, direction)) : array

export const arrayReduceBy = (array, by, to, id, noName) => array.reduce((acc, obj) => {
  if (obj[by] !== undefined) {
    obj[by].forEach(el => {
      if (!acc[el]) {
        acc[el] = { [to]: [obj[id]] }
      } else {
        acc[el][to].push(obj[id])
      }
    })
  } else {
    if (!acc[noName]) {
      acc[noName] = { [to]: [obj[id]] }
    } else {
      acc[noName][to].push(obj[id])
    }
  }

  return acc
}, {})

export const resolveErrorObject = error => {
  const resolveError = getNestedObject(error, COMMON_API.ERROR_PATH)

  if (resolveError !== undefined) {
    return resolveError
  }

  const alternateResolveError = getNestedObject(error, COMMON_API.ERROR_STATUS_PATH)

  if (alternateResolveError !== undefined) {
    return alternateResolveError
  }

  return error.toString()
}
