export const getNestedObject = (nestedObject, pathArray) => {
  return pathArray.reduce((object, key) =>
      (object && object[key] !== 'undefined') ? object[key] : undefined,
    nestedObject
  )
}
