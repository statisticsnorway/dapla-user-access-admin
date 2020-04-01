export const getNestedObject = (nestedObject, pathArray) =>
  pathArray.reduce((object, key) =>
    (object && object[key] !== 'undefined') ? object[key] : undefined, nestedObject
  )

export const sortArrayOfObjects = (array, by, direction = 'ascending') => {
  if (direction === 'ascending') {
    return array.sort((a, b) => a[by].localeCompare(b[by]))
  } else {
    return array.sort((a, b) => b[by].localeCompare(a[by]))
  }
}
