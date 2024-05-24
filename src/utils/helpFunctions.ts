import type { LocationQuery } from 'vue-router'

export function updateQueryParams(params: LocationQuery, newKey: string, newValue: string) {
  const obj = Object.assign({}, params)

  switch (newKey) {
    case 'search': {
      delete obj.page
      break
    }
    case 'limit':
      delete obj.page
      obj[newKey] = newValue
      break
    default:
      if (!newValue) delete obj[newKey]
      else {
        obj[newKey] = newValue
      }
  }
  return obj
}
