import { IVPolicialAvaliacaoSituacao } from '@/_domain/avaliacoes/repositories/v-policiais-avaliacoes-situacoes-repository-interface'
import { IGraduacao } from './graduacoes-repository-interface'
import { IPessoa } from './pessoas-repository-interface'

import { IUnidade } from './unidades-repository-interface'

export interface IPessoaPm {
  pm_codigo: string
  pm_cpf: string
  pm_apelido: string
  pm_numero: string
  gra_codigo: number
  uni_codigo: number
  data_alteracao: Date
  pts_codigo: number
  pms_codigo: number
  pm_foto: Buffer
  pm_data_entrada: Date
  usuario_alteracao: string
  pessoa?: IPessoa
  graduacao?: IGraduacao
  opm?: IUnidade
  policial_avaliacao_situacao?: IVPolicialAvaliacaoSituacao
}

export interface OutputBuscarPoliciaisPelaPesquisa {
  pes_codigo: string
  gra_sigla: string
  pes_nome: string
}

export interface IPessoasPmRepository {
  buscarPeloId(id: string): Promise<IPessoaPm | null>
  buscarImagemPeloId(id: string): Promise<IPessoaPm | null>
  buscarOficiaisPelaPesquisa(
    pesquisa: string,
  ): Promise<OutputBuscarPoliciaisPelaPesquisa[]>
  buscarPoliciaisPelaPesquisa(
    pesquisa: string,
  ): Promise<OutputBuscarPoliciaisPelaPesquisa[]>
  buscarSoldadosPelaPesquisa(
    pesquisa: string,
  ): Promise<OutputBuscarPoliciaisPelaPesquisa[]>
  buscarOficiaisPelasOpms(opms: number[]): Promise<IPessoaPm[]>
  buscarPeloIdComPessoa(id: string): Promise<IPessoaPm | null>
  buscarPeloIdComPessoaEGraduacao(id: string): Promise<IPessoaPm | null>
  buscarPeloIdComAvalicaoSituacao(id: string): Promise<IPessoaPm | null>
}
