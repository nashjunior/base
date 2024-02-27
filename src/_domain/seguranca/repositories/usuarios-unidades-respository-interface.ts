import { IUnidade } from '@/_domain/pessoas/repositories/unidades-repository-interface'

export interface IUsuarioUnidade {
  usu_codigo: string
  uni_codigo: number
  sis_codigo: number
  unidade?: IUnidade
}

export interface IUsuariosUnidadesRepository {
  buscarPelaMatriculaIdsLobAtual(
    pes_codigo: string,
    idsLobAtual: number[],
    idSgpm: number,
  ): Promise<IUsuarioUnidade[]>
}
