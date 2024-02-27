import {
  IVPoliciaisAfastamentosRepository,
  IVPolicialAfastamento,
} from '@/_domain/afastamentos/repositories/v-policiais-afastamentos-repository-interface'

interface Input {
  pagina?: number
  limite?: number
  pesquisa?: string
  subtipo?: 'individual' | 'todos'
}

interface Output {
  totalPaginas?: number
  itens: IVPolicialAfastamento[]
}

export class ListarAfastamentosUsecase {
  constructor(
    private vafastamentosRepository: IVPoliciaisAfastamentosRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const afastamentos = await this.vafastamentosRepository.buscarTodos(input)

    return afastamentos
  }
}
