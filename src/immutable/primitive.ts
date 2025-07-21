export type PrimitiveValue = string | number | boolean | null | undefined
export type PrimitiveArray = PrimitiveData[]
export type PrimitiveObject = {
  [key in string]: PrimitiveData
}
export type PrimitiveData = PrimitiveObject | PrimitiveArray | PrimitiveValue