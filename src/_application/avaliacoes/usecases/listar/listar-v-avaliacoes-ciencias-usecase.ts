import {
  IVAvaliacaoCiencia,
  IVAvaliacoesCienciasRepository,
} from '@/_domain/avaliacoes/repositories/v-avaliacoes-ciencias-repository-interface'

export interface Input {
  pagina?: number
  limite?: number
  pesquisa?: string
  deu_ciencia?: string
  id_colegiado?: number
}

interface Output {
  totalPaginas?: number
  itens: IVAvaliacaoCiencia[]
}

export class ListarVAvaliacoesCienciasUsecase {
  constructor(
    private vAvaliacoesCienciasRepository: IVAvaliacoesCienciasRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { totalPaginas, itens } =
      await this.vAvaliacoesCienciasRepository.buscarTodas(input)

    return {
      totalPaginas,
      itens,
    }
  }
}
