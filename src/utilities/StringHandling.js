export const makeEnum = string => string.split(/(?=[A-Z])/).join(' ').replace(' ', '_').toUpperCase()
