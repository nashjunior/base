import { Repository } from 'typeorm'
import { AppDataSource } from '../..'
import { Usuario } from '../../models/seguranca/usuario'
import {
  IUsuariosRepository,
  CriarUsuarioInput,
  OutPutBuscarPelaMatricula,
  UsuarioOmit,
} from '@/_domain/seguranca/repositories/usuarios-repository-interface'

export class UsuariosRepository implements IUsuariosRepository {
  private ormRepository: Repository<Usuario>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Usuario)
  }

  criar(dados: CriarUsuarioInput): Promise<UsuarioOmit | null> {
    throw new Error('Method not implemented.')
  }

  public async buscarPelaMatricula(
    matricula: string,
  ): Promise<OutPutBuscarPelaMatricula | null> {
    const usuario = await this.ormRepository.findOne({
      select: ['usu_senha', 'usu_codigo'],
      where: { usu_codigo: matricula },
    })

    return usuario
  }
}
