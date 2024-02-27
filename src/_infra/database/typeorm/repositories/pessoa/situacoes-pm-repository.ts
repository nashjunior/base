import { EntityManager, Repository } from 'typeorm'

import { AppDataSource } from '../..'
import { SituacaoPm } from '../../models/pessoa/situacao-pm'
import {
  ISituacao,
  ISituacoesPmRepository,
} from '@/_domain/pessoas/repositories/situacoes-pm-repository-interface'

export class SituacoesPmRepository implements ISituacoesPmRepository {
  private ormRepository: Repository<SituacaoPm>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(SituacaoPm)
      : AppDataSource.getRepository(SituacaoPm)
  }

  public async buscarSituacoesPmIndisponivelDefinitivo(): Promise<ISituacao[]> {
    const TIPO_SITUACAO_ATIVO = 1
    const situacoes = await this.ormRepository.find({
      where: {
        spm_tipo: '1',
        tsp_codigo: TIPO_SITUACAO_ATIVO,
      },
    })

    return situacoes
  }
}
