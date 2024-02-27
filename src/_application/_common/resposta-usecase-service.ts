export class Erro<E> {
  readonly value: E
  readonly statusCode: number

  constructor(value: E, statusCode: number) {
    this.value = value
    this.statusCode = statusCode
  }

  ehErro(): this is Erro<E> {
    return true
  }
}

export class Sucesso<S> {
  readonly value: S
  readonly statusCode: number

  constructor(value: S, statusCode: number) {
    this.value = value
    this.statusCode = statusCode
  }

  ehErro(): this is Sucesso<S> {
    return false
  }
}

export type Resposta<E, S> = Erro<E> | Sucesso<S>

export const erro = <E>(value: E, statusCode: number): Erro<E> => {
  return new Erro(value, statusCode)
}

export const sucesso = <S>(value: S, statusCode: number): Sucesso<S> => {
  return new Sucesso(value, statusCode)
}
