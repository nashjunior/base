export interface IVBoletim {
  bol_codigo: number
  nrboletim: string
  nrboletimpublicacao: string
}

export interface IVBoletinsRepository {
  buscarPelaPesquisa(pesquisa: string): Promise<IVBoletim[]>
}
