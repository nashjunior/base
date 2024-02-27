import { ISistema } from './sistemas-respository-interface'
export interface IGrupo {
  gru_codigo: number
  sis_codigo: number
  gru_nome: string
  sistema?: ISistema
}

export interface IGruposUsuarioRepository {
  buscarPelaMatriculaESistema(
    matricula: string,
    sistema: number | undefined,
    usuario_padrao_acessa: boolean | undefined,
  ): Promise<IGrupo[] | null>
}
