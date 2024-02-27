import { EntityManager, ILike, Repository } from 'typeorm'
import { AppDataSource } from '../..'

import {
  IVBoletim,
  IVBoletinsRepository,
} from '@/_domain/boletins/repositories/v-boletins-repository-interface'
import { VBoletim } from '../../models/boletim/v-boletim'

export class VBoletinsRepository implements IVBoletinsRepository {
  private ormRepository: Repository<VBoletim>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(VBoletim)
      : AppDataSource.getRepository(VBoletim)
  }

  public async buscarPelaPesquisa(pesquisa: string): Promise<IVBoletim[]> {
    const boletins = await this.ormRepository.find({
      where: { nrboletimpublicacao: ILike(`%${pesquisa}%`) },
      take: 15,
    })

    return boletins
  }
}
