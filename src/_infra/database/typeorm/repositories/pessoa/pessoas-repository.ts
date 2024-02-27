import { EntityManager, Repository } from 'typeorm'
import { AppDataSource } from '../..'
import { Pessoa } from '../../models/pessoa/pessoa'
import {
  IPessoa,
  IPessoasRepository,
} from '@/_domain/pessoas/repositories/pessoas-repository-interface'

export class PessoasRepository implements IPessoasRepository {
  private ormRepository: Repository<Pessoa>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(Pessoa)
      : AppDataSource.getRepository(Pessoa)
  }

  public async buscarPessoaPeloPesCodigo(
    pes_codigo: string,
  ): Promise<IPessoa | null> {
    const pessoa = await this.ormRepository.findOne({
      select: ['pes_codigo', 'pes_nome', 'pes_tipo'],
      where: { pes_codigo },
    })

    return pessoa
  }
}
