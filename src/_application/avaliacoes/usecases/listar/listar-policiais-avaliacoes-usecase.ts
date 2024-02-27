import { formatarArrayDatas } from '@/_application/_common/utils/formatarArrayDatas'
import {
  IVPoliciaisAvaliacoesRepository,
  IVPolicialAvaliacao,
} from '@/_domain/avaliacoes/repositories/v-policiais-avaliacoes-repository-interface'

export interface Input {
  pagina?: number
  limite?: number
  idColegiado?: number
  pesquisa?: string
}
interface Output {
  totalPaginas?: number
  itens: IVPolicialAvaliacao[]
}

export class ListarPoliciaisAvaliacoesUsecase {
  constructor(
    private policiaisAvaliacoesRepository: IVPoliciaisAvaliacoesRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { totalPaginas, itens } =
      await this.policiaisAvaliacoesRepository.buscarTodas(input)

    return {
      totalPaginas,
      itens: formatarArrayDatas(itens),
    }
  }
}
