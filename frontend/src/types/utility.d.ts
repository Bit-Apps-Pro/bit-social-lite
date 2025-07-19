export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

type KeysOfValue<T> = {
  [K in keyof T]: K
}[keyof T]
