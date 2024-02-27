import { IUnidade } from '@/_domain/pessoas/application/repositories/unidades-repository-interface'

export interface IBoletim {
  bol_codigo: number
  bol_numero: number
  bol_ano: number
  bol_data: string
  pes_unidade: string
  unidade?: IUnidade
}

export interface IBoletinsRepository {
  buscarPeloId(id: number): Promise<IBoletim | null>
  buscarPeloIdComUnidade(id: number): Promise<IBoletim | null>
}
