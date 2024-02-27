import { EntityManager, Repository } from 'typeorm'
import { AppDataSource } from '../..'

import {
  IBoletim,
  IBoletinsRepository,
} from '@/_domain/boletins/repositories/boletins-repository-interface'
import { Boletim } from '../../models/boletim/boletim'

export class BoletinsRepository implements IBoletinsRepository {
  private ormRepository: Repository<Boletim>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(Boletim)
      : AppDataSource.getRepository(Boletim)
  }

  public async buscarPeloId(id: number): Promise<IBoletim | null> {
    const boletim = await this.ormRepository.findOne({
      where: { bol_codigo: id },
    })

    return boletim
  }

  public async buscarPeloIdComUnidade(id: number): Promise<IBoletim | null> {
    const boletim = await this.ormRepository.findOne({
      where: { bol_codigo: id },
      relations: { unidade: true },
    })

    return boletim
  }
}
