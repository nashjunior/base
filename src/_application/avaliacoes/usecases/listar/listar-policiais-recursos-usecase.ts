import { formatarArrayDatas } from '@/_application/_common/utils/formatarArrayDatas'
import {
  IVPoliciaisRecursosRepository,
  IVPolicialRecurso,
} from '@/_domain/avaliacoes/repositories/v-policiais-recursos-repository-interface'

export interface Input {
  pagina?: number
  limite?: number
  status?: string
  pesquisa?: string
}

interface Output {
  totalPaginas?: number
  itens: IVPolicialRecurso[]
}

export class ListarPoliciaisRecursosUsecase {
  constructor(
    private policiaisRecursosRepository: IVPoliciaisRecursosRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { totalPaginas, itens } =
      await this.policiaisRecursosRepository.buscarTodos(input)

    return {
      totalPaginas,
      itens: formatarArrayDatas(itens),
    }
  }
}
