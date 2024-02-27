import {
  EnumSubTipoAfastamento,
  PlainTipoAfastamento,
} from '@/_domain/afastamentos/entities/tipo-afastamento'
import { ITiposAfastamentosRepository } from '@/_domain/afastamentos/repositories/tipos-afastamentos-repository-interface'

interface Input {
  subtipo?: EnumSubTipoAfastamento
}

export class ListarTiposAfastamentosUsecase {
  constructor(
    private tiposAfastamentosRepository: ITiposAfastamentosRepository,
  ) {}

  async execute(input: Input): Promise<PlainTipoAfastamento[]> {
    const tipos = await this.tiposAfastamentosRepository.buscarTodos(input)

    return tipos.map((tipo) => tipo.toPlainObject())
  }
}
