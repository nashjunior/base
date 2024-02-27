import AppError from '@/_application/_common/errors/app-error'
import { formatarObjetoDatas } from '@/_application/_common/utils/formatarObjetoDatas'
import { PlainAvaliacao } from '@/_domain/avaliacoes/entities/avaliacao'

import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'

export class MostrarAvaliacaoUsecase {
  constructor(private avaliacoesRepository: IAvaliacoesRepository) {}

  async execute(id_avaliacao: number): Promise<PlainAvaliacao> {
    const avaliacao = await this.avaliacoesRepository.buscarPeloIdCompleto(
      id_avaliacao,
    )

    if (!avaliacao) {
      throw new AppError(
        'A avaliação informada não existe na base de dados.',
        404,
      )
    }

    if (avaliacao.recurso) {
      return {
        ...avaliacao.toPlainObject(),
        recurso: formatarObjetoDatas(avaliacao.recurso.toPlainObject()),
      }
    }

    return avaliacao.toPlainObject()
  }
}
