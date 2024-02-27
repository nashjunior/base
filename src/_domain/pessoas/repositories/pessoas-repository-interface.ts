import { IPessoaPm } from './pessoas-pm-repository-interface'

export interface IPessoa {
  pes_codigo: string
  pes_nome: string
  pes_tipo: string
  pessoa_pm?: IPessoaPm
}

export interface IPessoasRepository {
  buscarPessoaPeloPesCodigo(pes_codigo: string): Promise<IPessoa | null>
}
