import AppError from '@/_application/_common/errors/app-error'

import {
  EnumSubTipoAfastamento,
  PlainTipoAfastamento,
  TipoAfastamento,
} from '@/_domain/afastamentos/entities/tipo-afastamento'
import { ITiposAfastamentosRepository } from '@/_domain/afastamentos/repositories/tipos-afastamentos-repository-interface'

export interface Input {
  subtipo: EnumSubTipoAfastamento
  descricao: string
  criado_por: string
}
export class CriarTipoAfastamentosUsecase {
  constructor(
    private tiposAfastamentosRepository: ITiposAfastamentosRepository,
  ) {}

  async execute(input: Input): Promise<PlainTipoAfastamento> {
    const tipoJaExiste =
      await this.tiposAfastamentosRepository.buscarPelaDescricao(
        input.descricao,
      )

    if (tipoJaExiste) {
      throw new AppError('Tipo já existe na base de dados.', 400)
    }

    const tipo = new TipoAfastamento({
      ...input,
      criado_em: new Date(),
    })

    const tipoSalvo = await this.tiposAfastamentosRepository.criar(tipo)

    return tipoSalvo.toPlainObject()
  }
}
