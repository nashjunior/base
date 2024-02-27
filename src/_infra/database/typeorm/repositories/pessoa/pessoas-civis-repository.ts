import { EntityManager, Repository } from 'typeorm'
import { AppDataSource } from '../..'
import { PessoaCivil } from '../../models/pessoa/pessoa-civil'
import {
  IPessoasCivisRepository,
  OutputBuscarPessoaCivil,
} from '@/_domain/pessoas/repositories/pessoas-civis-repository-interface'

export class PessoasCivisRepository implements IPessoasCivisRepository {
  private ormRepository: Repository<PessoaCivil>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(PessoaCivil)
      : AppDataSource.getRepository(PessoaCivil)
  }

  public async buscarPeloPesCodigo(
    pes_codigo: string,
  ): Promise<OutputBuscarPessoaCivil | null> {
    const pessoa = await this.ormRepository.findOne({
      select: ['civil_codigo', 'uni_codigo', 'cvt_codigo'],
      where: { civil_codigo: pes_codigo },
    })

    return pessoa
  }
}
