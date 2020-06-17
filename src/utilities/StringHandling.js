export const makeEnum = string => string.split(/(?=[A-Z])/).join(' ').replace(' ', '_').toUpperCase()

export const truncateString = (string, length = 32) => {
  if (typeof string === 'string') {
    return string.length > length ? string.substring(0, (length - 2)) + '...' : string
  } else {
    return '...'
  }
}
