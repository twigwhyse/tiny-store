export type ValueUpdater<T> = T | ((v: T) => T)

export function updateObject<T extends { [key: string]: any }>(obj: T, value: {
  [x in keyof T]?: ValueUpdater<T[x]>
}): T {
  const newObj = { ...obj }
  let hasChanged = false
  Object.keys(value).forEach(key => {
    if (value[key] instanceof Function && key in newObj) {
      const newValue = value[key](newObj[key] as T[typeof key])
      if (newValue !== newObj[key]) {
        newObj[key as keyof T] = newValue as T[typeof key]
        hasChanged = true
      }
    } else if (key in newObj) {
      const newValue = value[key]
      if (newValue !== newObj[key]) {
        newObj[key as keyof T] = newValue as T[typeof key]
        hasChanged = true
      }
    }
  })
  return hasChanged ? newObj : obj
}