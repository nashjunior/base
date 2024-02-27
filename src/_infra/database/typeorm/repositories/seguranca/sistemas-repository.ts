import { EntityManager, Repository } from 'typeorm'
import { AppDataSource } from '../..'
import { Sistema } from '../../models/seguranca/sistema'
import {
  ISistema,
  ISistemasRepository,
} from '@/_domain/seguranca/repositories/sistemas-respository-interface'

export class SistemasRepository implements ISistemasRepository {
  private ormRepository: Repository<Sistema>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(Sistema)
      : AppDataSource.getRepository(Sistema)
  }

  public async buscarPelaSigla(sigla: string): Promise<ISistema | null> {
    const sistema = await this.ormRepository.findOne({
      where: { sis_sigla: sigla },
    })

    return sistema
  }

  public async buscarPeloId(id_sistema: number): Promise<ISistema | null> {
    const sistema = await this.ormRepository.findOne({
      where: { sis_codigo: id_sistema },
    })

    return sistema
  }
}
