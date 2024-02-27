export interface ISistema {
  sis_codigo: number
  sis_nome: string
  sis_sigla: string
  usuario_padrao_acessa: boolean
  sgpm: boolean
}

export interface ISistemasRepository {
  buscarPeloId(id_sistema: number): Promise<ISistema | null>
  buscarPelaSigla(sigla: string): Promise<ISistema | null>
}
