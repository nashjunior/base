import AppError from '@/_application/_common/errors/app-error'
import { formatarObjetoDatas } from '@/_application/_common/utils/formatarObjetoDatas'
import { PlainAvaliacao } from '@/_domain/avaliacoes/entities/avaliacao'
import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'

interface Input {
  avaliado: string
  numero: number
}

export class MostrarAvaliacaoPeloAvaliadoNumeroUsecase {
  constructor(private avaliacoesRepository: IAvaliacoesRepository) {}

  async execute({ avaliado, numero }: Input): Promise<PlainAvaliacao> {
    const avaliacao =
      await this.avaliacoesRepository.buscarPeloAvaliadoNumeroCompleto(
        avaliado,
        numero,
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
        recurso: formatarObjetoDatas(avaliacao.recurso),
      }
    }

    return avaliacao.toPlainObject()
  }
}
