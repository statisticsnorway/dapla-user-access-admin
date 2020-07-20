export const convertToDatetimeJsonString = timestamp => {
  if (timestamp !== null && timestamp !== undefined && timestamp !== '') {
    try {
      const date = new Date(timestamp - 1000)

      return date.toISOString()
    } catch (e) {
      console.log(e)

      return timestamp
    }
  } else {
    return null
  }
}
