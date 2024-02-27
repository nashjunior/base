export interface IService<T, U> {
  execute: (args: T) => U
}
