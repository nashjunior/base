import { IBoletinsRepository } from '@/_domain/boletins/repositories/boletins-repository-interface'

import { IAfastamentosRepository } from '@/_domain/afastamentos/repositories/afastamentos-repository-interface'
import {
  Afastamento,
  PlainAfastamento,
} from '@/_domain/afastamentos/entities/afastamento'
import AppError from '@/_application/_common/errors/app-error'
import { gerarPathBoletim } from '@/_application/_common/utils/gerar-path-boletim'

interface Input {
  id_tipo_afastamento: number
  id_policial: string | null
  data_inicial: Date
  data_final: Date
  observacao: string
  bol_codigo: number
  criado_por: string
  atualizado_por: string
}
export class CriarAfastamentosUsecase {
  constructor(
    private afastamentosRepository: IAfastamentosRepository,
    private boletinsRepository: IBoletinsRepository,
  ) {}

  async execute(input: Input): Promise<PlainAfastamento> {
    const boletim = await this.boletinsRepository.buscarPeloIdComUnidade(
      input.bol_codigo,
    )

    if (!boletim) {
      throw new AppError(
        'O boletim informado não existe na base de dados.',
        404,
      )
    }

    const pathBoletim = gerarPathBoletim(boletim)

    const afastamento = new Afastamento({
      ...input,
      path_boletim: pathBoletim,
      criado_por: input.criado_por,
      criado_em: new Date(),
      atualizado_por: input.atualizado_por,
      atualizado_em: new Date(),
      deletado_em: null,
      deletado_por: null,
    })

    const afastamentoSalvo = await this.afastamentosRepository.criar(
      afastamento,
    )

    return afastamentoSalvo.toPlainObject()
  }
}
