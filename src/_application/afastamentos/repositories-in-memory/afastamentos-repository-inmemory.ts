import { Afastamento } from '@/_domain/afastamentos/entities/afastamento'
import { IAfastamentosRepository } from '@/_domain/afastamentos/repositories/afastamentos-repository-interface'

export class AfastamentosInMemoryRepository implements IAfastamentosRepository {
  private itens: Afastamento[] = []
  private autoIncrementId: number = 1

  async criar(entity: Afastamento): Promise<Afastamento> {
    const entityCriada = entity
    entityCriada.id_afastamento = this.autoIncrementId++
    this.itens.push(entityCriada)
    return entityCriada
  }

  async atualizar(entity: Afastamento): Promise<Afastamento> {
    const index = this.itens.findIndex(
      (af) => af.id_afastamento === entity.id_afastamento,
    )
    if (index === -1) {
      throw new Error('Afastamento não encontrado.')
    }

    this.itens[index] = entity
    return entity
  }

  async buscarPeloId(id: number): Promise<Afastamento | null> {
    return this.itens.find((af) => af.id_afastamento === id) || null
  }

  async remover(id: number): Promise<void> {
    const index = this.itens.findIndex((af) => af.id_afastamento === id)
    if (index !== -1) {
      this.itens.splice(index, 1)
    }
  }

  async buscarPeloPolicial(matricula: string): Promise<Afastamento[]> {
    return this.itens.filter((af) => af.id_policial?.valor === matricula)
  }
}
