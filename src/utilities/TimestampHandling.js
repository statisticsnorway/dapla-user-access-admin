export const convertToDatetimeJsonString = timestamp => {
  const date = new Date(timestamp - 1000)

  return date.toISOString()
}
