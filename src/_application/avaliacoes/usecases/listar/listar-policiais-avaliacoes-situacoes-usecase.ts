import {
  IVPoliciaisAvaliacoesSituacoesRepository,
  IVPolicialAvaliacaoSituacao,
} from '@/_domain/avaliacoes/repositories/v-policiais-avaliacoes-situacoes-repository-interface'

export interface Input {
  pagina?: number
  limite?: number
  situacao: string
  idColegiado?: number
  pesquisa?: string
}

interface Output {
  totalPaginas?: number
  itens: IVPolicialAvaliacaoSituacao[]
}

export class ListarPoliciaisAvaliacoesSituacoesUsecase {
  constructor(
    private policiaisAvaliacoesRepository: IVPoliciaisAvaliacoesSituacoesRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { totalPaginas, itens } =
      await this.policiaisAvaliacoesRepository.buscarTodas(input)

    return {
      totalPaginas,
      itens,
    }
  }
}
