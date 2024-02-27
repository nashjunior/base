import {
  IVAvaliacaoSga,
  IVAvaliacoesSgaRepository,
} from '@/_domain/avaliacoes/repositories/v-avaliacoes-sga-repository-interface'

export interface Input {
  pagina?: number
  limite?: number
  matricula: string
  pesquisa?: string
  assinou?: string
}

interface Output {
  totalPaginas?: number
  itens: IVAvaliacaoSga[]
}

export class ListarVAvaliacoesSgaUsecase {
  constructor(private vAvaliacoesSgaRepository: IVAvaliacoesSgaRepository) {}

  async execute(input: Input): Promise<Output> {
    const { totalPaginas, itens } =
      await this.vAvaliacoesSgaRepository.buscarTodas(input)

    return {
      totalPaginas,
      itens,
    }
  }
}
