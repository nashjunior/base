export interface ISituacao {
  spm_codigo: number
  tsp_codigo: number
  spm_nome: string
  spm_tipo: string
}

export interface ISituacoesPmRepository {
  buscarSituacoesPmIndisponivelDefinitivo(): Promise<ISituacao[]>
}
