import { EntityManager, Repository } from 'typeorm'
import { AppDataSource } from '../..'
import { Graduacao } from '../../models/pessoa/graduacao'
import { IGraduacoesRepository } from '@/_domain/pessoas/repositories/graduacoes-repository-interface'

export class GraduacoesRepository implements IGraduacoesRepository {
  private ormRepository: Repository<Graduacao>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(Graduacao)
      : AppDataSource.getRepository(Graduacao)
  }

  public async buscarPeloCodigo(id: number): Promise<Graduacao | null> {
    const graduacao = await this.ormRepository.findOne({
      where: { gra_codigo: id },
    })

    return graduacao
  }
}
