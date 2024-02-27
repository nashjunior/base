import AppError from '@/_application/_common/errors/app-error'
import {
  IVPoliciaisAvaliacoesSituacoesRepository,
  IVPolicialAvaliacaoSituacao,
} from '@/_domain/avaliacoes/repositories/v-policiais-avaliacoes-situacoes-repository-interface'

export class MostrarPolicialAvaliacoesSituacaoUsecase {
  constructor(
    private vPoliciaisAvaliacoesRepository: IVPoliciaisAvaliacoesSituacoesRepository,
  ) {}

  async execute(matricula: string): Promise<IVPolicialAvaliacaoSituacao> {
    const policial =
      await this.vPoliciaisAvaliacoesRepository.buscarPelaMatricula(matricula)

    if (!policial) {
      throw new AppError(
        'O policial informado não foi encontrado na base de dados.',
        404,
      )
    }

    return policial
  }
}
