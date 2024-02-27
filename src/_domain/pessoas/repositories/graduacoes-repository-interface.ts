export interface IGraduacao {
  gra_codigo: number
  gra_nome: string
  gra_sigla: string
  gra_oficial: string
}

export interface IGraduacoesRepository {
  buscarPeloCodigo(id: number): Promise<IGraduacao | null>
}
