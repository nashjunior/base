import { FindOptionsWhere, Repository } from 'typeorm'
import { AppDataSource } from '../..'

import { addMultipleColumnsSearch } from '../../utils/conditions-where'

import { VOficialCGPTypeOrm } from '../../models/segep/v-oficiais-cgp'
import {
  IVOficiaisCGPRepository,
  InputPesquisa,
} from '@/_domain/pessoas/repositories/v-oficiais-cgp-repository-interface'

export class VOficiaisCGPRepository implements IVOficiaisCGPRepository {
  private ormRepository: Repository<VOficialCGPTypeOrm>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(VOficialCGPTypeOrm)
  }

  public async buscarPelaPesquisa({
    pesquisa,
  }: InputPesquisa): Promise<VOficialCGPTypeOrm[]> {
    const whereClause: FindOptionsWhere<VOficialCGPTypeOrm>[] = []

    addMultipleColumnsSearch<VOficialCGPTypeOrm>(
      whereClause,
      ['pes_nome', 'pes_codigo'],
      pesquisa,
    )

    const oficiais = await this.ormRepository.find({
      where: whereClause,
    })

    return oficiais
  }
}
