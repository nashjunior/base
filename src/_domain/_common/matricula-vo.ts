import { env } from '@/env'

export class Matricula {
  private _valor: string

  constructor(valor: string) {
    this._valor = valor.toUpperCase()
    this.validar()
  }

  private validar() {
    if (env.NODE_ENV !== 'production') return
    if (this.valor.length < 8) {
      throw new Error('A matrícula deve possuir 8 ou mais caracteres.')
    }

    // Verifica se os primeiros caracteres são todos números
    const parteNumerica = this.valor.slice(0, -1)
    if (!/^\d+$/.test(parteNumerica)) {
      throw new Error('Matrícula inválida.')
    }
  }

  get valor(): string {
    return this._valor
  }
}
