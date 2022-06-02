export const create = (value, userId) => {
  const flatObject = {}
  for (const key in value) {
    flatObject[key] = tiny.create(value[key], userId)
  }
  return flatObject
}

export const setChildByKey = (flatObject, key, value, userId, version = 0) => {
  if (flatObject[key] === undefined) {
    flatObject[key] = tiny.create(value, userId)
    return flatObject[key]
  } else {
    return tiny.update(flatObject[key], value, version, userId) !== null
  }
}

export const getChildByKey = (flatObject, key) => {
  return flatObject[key] ?? null
}
