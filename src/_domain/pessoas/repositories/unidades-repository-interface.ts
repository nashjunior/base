export interface IUnidade {
  uni_codigo: number
  uni_nome: string
  uni_sigla: string
  uni_superior: number
  uni_grd_cmdo: number
  uni_lob: number
  pes_codigo: string
  uni_boletim_caminho: string
}
export interface IUnidadesRepository {
  buscarPeloId(id: number): Promise<IUnidade | null>
  buscarPelaPesquisa(pesquisa: string): Promise<IUnidade[]>
  buscarIdsLobAtual(): Promise<number[]>
  buscarPelosIds(ids: number[]): Promise<IUnidade[]>
}
