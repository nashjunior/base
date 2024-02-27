import { EntityManager, In, Repository } from 'typeorm'

import { AppDataSource } from '../..'

import { PmSituacao } from '../../models/pessoa/pm-situacao'
import {
  IPmSituacao,
  IPmSituacoesRepository,
} from '@/_domain/pessoas/repositories/pm-situacoes-repository-interface'

export class PmSituacoesRepository implements IPmSituacoesRepository {
  private ormRepository: Repository<PmSituacao>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(PmSituacao)
      : AppDataSource.getRepository(PmSituacao)
  }

  public async buscarQueSuspedemEstagioPelaMatricula(
    matricula: string,
  ): Promise<IPmSituacao[]> {
    // 4 - LICENCA - LTIP (ART.62 III)
    // 140 - LICENCA - LTS DEPENDENTE (ART.62 IV)
    // 3 - LICENCA - LTS PRÓPRIA (ART.62 V)
    // 166 - CURSANDO - OUTROS (GERA INDISPONIBILIDADE)
    // 10 - CURSANDO - FORA DO ESTADO
    const situacoes = await this.ormRepository.find({
      where: {
        pes_pm: matricula,
        spm_codigo: In([3, 4, 10, 140, 166]),
        pms_status: '2',
      },
    })
    return situacoes
  }
}
