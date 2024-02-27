import { TipoAfastamento } from '@/_domain/afastamentos/entities/tipo-afastamento'

import {
  ITiposAfastamentosRepository,
  InputBuscarTodos,
} from '@/_domain/afastamentos/repositories/tipos-afastamentos-repository-interface'

export class TiposAfastamentosInMemoryRepository
  implements ITiposAfastamentosRepository
{
  private itens: TipoAfastamento[] = []
  private autoIncrementId: number = 1

  async criar(entity: TipoAfastamento): Promise<TipoAfastamento> {
    const entityCriada = entity
    entityCriada.id_tipo_afastamento = this.autoIncrementId++
    this.itens.push(entityCriada)
    return entityCriada
  }

  async atualizar(entity: TipoAfastamento): Promise<TipoAfastamento> {
    const index = this.itens.findIndex(
      (af) => af.id_tipo_afastamento === entity.id_tipo_afastamento,
    )
    if (index === -1) {
      throw new Error('TipoAfastamento não encontrado.')
    }

    this.itens[index] = entity
    return entity
  }

  async buscarPeloId(id: number): Promise<TipoAfastamento | null> {
    return this.itens.find((af) => af.id_tipo_afastamento === id) || null
  }

  async remover(id: number): Promise<void> {
    const index = this.itens.findIndex((af) => af.id_tipo_afastamento === id)
    if (index !== -1) {
      this.itens.splice(index, 1)
    }
  }

  async buscarPelaDescricao(
    descricao: string,
  ): Promise<TipoAfastamento | null> {
    return this.itens.find((af) => af.descricao === descricao) || null
  }

  async buscarTodos({ subtipo }: InputBuscarTodos): Promise<TipoAfastamento[]> {
    return this.itens.filter((af) => af.subtipo === subtipo)
  }
}
