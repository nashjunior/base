import { EntityManager, In, Repository } from 'typeorm'
import { AppDataSource } from '../..'
import { UsuarioUnidade } from '../../models/seguranca/usuario-unidade'
import {
  IUsuarioUnidade,
  IUsuariosUnidadesRepository,
} from '@/_domain/seguranca/repositories/usuarios-unidades-respository-interface'

export class UsuariosUnidadesRepository implements IUsuariosUnidadesRepository {
  private ormRepository: Repository<UsuarioUnidade>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(UsuarioUnidade)
      : AppDataSource.getRepository(UsuarioUnidade)
  }

  public async buscarPelaMatriculaIdsLobAtual(
    pes_codigo: string,
    idsLobAtual: number[],
    idSgpm: number,
  ): Promise<IUsuarioUnidade[]> {
    const unidades = await this.ormRepository.find({
      where: {
        usu_codigo: pes_codigo,
        uni_codigo: In([...idsLobAtual, -1]),
        sis_codigo: idSgpm,
      },
    })

    return unidades
  }
}
