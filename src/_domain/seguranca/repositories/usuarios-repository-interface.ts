export type CriarUsuarioInput = {
  usu_codigo: string
  usu_senha: string
}

export type UsuarioOmit = {
  usu_codigo: string
  usu_senha: string
}

export type OutPutBuscarPelaMatricula = {
  usu_senha: string
  usu_codigo: string
}

export interface IUsuariosRepository {
  buscarPelaMatricula(
    matricula: string,
  ): Promise<OutPutBuscarPelaMatricula | null>
  criar(dados: CriarUsuarioInput): Promise<UsuarioOmit | null>
}
