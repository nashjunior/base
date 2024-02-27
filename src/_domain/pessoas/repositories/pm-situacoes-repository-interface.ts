export interface IPmSituacao {
  pms_codigo: number
  spm_codigo: number
  pes_pm: string
  pms_status: string
  pms_data_inicial: Date
  pms_data_final: Date
}

export interface IPmSituacoesRepository {
  buscarQueSuspedemEstagioPelaMatricula(
    matricula: string,
  ): Promise<IPmSituacao[]>
}
