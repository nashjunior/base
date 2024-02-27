import { EntityManager, ILike, In, Not, Repository } from 'typeorm'
import { AppDataSource } from '../..'

import { Unidade } from '../../models/pessoa/unidade'
import {
  IUnidade,
  IUnidadesRepository,
} from '@/_domain/pessoas/repositories/unidades-repository-interface'

export class UnidadesRepository implements IUnidadesRepository {
  private ormRepository: Repository<Unidade>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(Unidade)
      : AppDataSource.getRepository(Unidade)
  }

  public async buscarIdsLobAtual(): Promise<number[]> {
    const unidadeLobAtual = await this.ormRepository.findOne({
      where: { uni_lob: Not(9999) },
      order: { uni_lob: 'DESC' },
    })

    const lobAtual = unidadeLobAtual?.uni_lob

    const unidades = await this.ormRepository.find({
      select: { uni_codigo: true },
      where: { uni_lob: lobAtual },
    })

    const ids = unidades.map((unidade) => unidade.uni_codigo)

    return ids
  }

  public async buscarPelosIds(ids: number[]): Promise<IUnidade[]> {
    const unidades = await this.ormRepository.find({
      select: { uni_codigo: true, uni_nome: true, uni_sigla: true },
      where: { uni_codigo: In(ids) },
    })

    return unidades
  }

  public async buscarPelaPesquisa(pesquisa: string): Promise<IUnidade[]> {
    const lobAtual = await this.ormRepository.findOne({
      select: { uni_lob: true },
      where: { uni_lob: Not(9999) },
      order: { uni_lob: 'DESC' },
    })

    const unidades = await this.ormRepository.find({
      where: [
        { uni_nome: ILike(`%${pesquisa}%`), uni_lob: lobAtual?.uni_lob },
        { uni_sigla: ILike(`%${pesquisa}%`), uni_lob: lobAtual?.uni_lob },
      ],
      take: 15,
    })

    return unidades
  }

  public async buscarPeloId(id: number): Promise<IUnidade | null> {
    const unidade = await this.ormRepository.findOne({
      where: { uni_codigo: id },
    })

    return unidade
  }
}
