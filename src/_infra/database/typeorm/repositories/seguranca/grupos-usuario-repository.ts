import { IsNull, Not, Repository } from 'typeorm'

import { AppDataSource } from '../..'

import { GrupoUsuario } from '../../models/seguranca/grupo-usuario'
import {
  IGrupo,
  IGruposUsuarioRepository,
} from '@/_domain/seguranca/repositories/grupos-usuario-repository-interface'

export class GruposUsuarioRepository implements IGruposUsuarioRepository {
  private ormRepository: Repository<GrupoUsuario>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(GrupoUsuario)
  }

  public async buscarPelaMatriculaESistema(
    matricula: string,
    sistema: number | undefined,
    usuario_padrao_acessa: boolean,
  ): Promise<IGrupo[] | null> {
    const gruposUsuarios = await this.ormRepository.find({
      where: {
        usu_codigo: matricula,
        gru_codigo: !usuario_padrao_acessa ? Not(200) : Not(IsNull()),
      },
      relations: ['grupo'],
    })

    if (!gruposUsuarios) {
      return null
    }

    const grupos = gruposUsuarios
      .filter((grupoUsuario) => {
        if (sistema) {
          if (grupoUsuario.grupo.sis_codigo === sistema) {
            return true
          }
          if (
            usuario_padrao_acessa &&
            grupoUsuario.grupo.gru_nome === 'USUARIO PADRAO'
          ) {
            return true
          }
          return false
        } else {
          return true
        }
      })
      .map((item) => item.grupo)

    if (grupos.length <= 0) {
      return null
    }

    const grupoUsuarioPadrao = grupos.find(
      (item) => item.gru_nome === 'USUARIO PADRAO',
    )

    if (grupoUsuarioPadrao) {
      const gruposSemUsuarioPadrao = grupos.filter(
        (item) => item.gru_nome !== 'USUARIO PADRAO',
      )

      return [grupoUsuarioPadrao, ...gruposSemUsuarioPadrao]
    }

    return grupos
  }
}
