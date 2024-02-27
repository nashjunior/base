import { utf8ParaLatin1 } from '@/_infra/utils/utf8-para-latin1'

export class InputUsuarioString {
  private _valor: string

  constructor(valor: string) {
    this._valor = utf8ParaLatin1(valor.toUpperCase())
    this.validar()
  }

  private validar() {}

  get valor(): string {
    return this._valor
  }
}
