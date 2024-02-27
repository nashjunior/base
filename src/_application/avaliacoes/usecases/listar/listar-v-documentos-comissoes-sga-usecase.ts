import {
  IVDocumentoSga,
  IVDocumentosSgaRepository,
} from '@/_domain/avaliacoes/repositories/v-documentos-sga-repository-interface'

export interface Input {
  pagina?: number
  limite?: number
  matricula: string
  pesquisa?: string
  assinou?: string
}

interface Output {
  totalPaginas?: number
  itens: IVDocumentoSga[]
}

export class ListarVDocumentosSgaUsecase {
  constructor(private vDocumentosSgaRepository: IVDocumentosSgaRepository) {}

  async execute(input: Input): Promise<Output> {
    const { totalPaginas, itens } =
      await this.vDocumentosSgaRepository.buscarTodas(input)

    return {
      totalPaginas,
      itens,
    }
  }
}
