import * as tiny from './tiny.js'

export const create = (values, userId) => {
  const arr = new Array(values.length)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = tiny.create(values[i], userId)
  }
  return arr
}

export const set = (arr, index, value, version, userId) => {
  return tiny.update(arr[index], value, version, userId) !== null
}

export const get = (arr, index) => {
  return arr[index]
}
