export interface IVOficialCGP {
  pes_codigo: string
  pes_nome: string
  gra_sigla: string
  uni_sigla: string
}

export interface InputPesquisa {
  pesquisa: string
}

export interface IVOficiaisCGPRepository {
  buscarPelaPesquisa(input: InputPesquisa): Promise<IVOficialCGP[]>
}
