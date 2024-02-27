import AppError from '@/_application/_common/errors/app-error'
import { formatarArrayDatas } from '@/_application/_common/utils/formatarArrayDatas'
import {
  IVPoliciaisAfastamentosRepository,
  IVPolicialAfastamento,
} from '@/_domain/afastamentos/repositories/v-policiais-afastamentos-repository-interface'
import {
  Avaliacao,
  PlainAvaliacao,
} from '@/_domain/avaliacoes/entities/avaliacao'
import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'

import {
  IPessoaPm,
  IPessoasPmRepository,
} from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'
import { AnotacaoRip } from '@/_domain/rips/entities/anotacao-rip'
import { IAnotacoesRipsRepository } from '@/_domain/rips/repositories/anotacoes-rips-repository-interface'

interface Output {
  policial: IPessoaPm
  avaliacoes: PlainAvaliacao[]
  afastamentos: IVPolicialAfastamento[]
  anotacoes: any[]
}
export class MostrarPolicialAvaliacoesAssinadasUsecase {
  constructor(
    private pessoasPmRepository: IPessoasPmRepository,
    private avaliacoesRepository: IAvaliacoesRepository,
    private vPoliciaisAvaliacoesRepository: IVPoliciaisAfastamentosRepository,
    private anotacoesRepository: IAnotacoesRipsRepository,
  ) {}

  async execute(matricula: string): Promise<Output> {
    const policial =
      await this.pessoasPmRepository.buscarPeloIdComAvalicaoSituacao(matricula)

    if (!policial) {
      throw new AppError(
        'O policial informado não foi encontrado na base de dados.',
        404,
      )
    }

    const avaliacoes = await this.avaliacoesRepository.buscarPelaMatricula(
      matricula,
    )

    const avalicoesAssinadas = avaliacoes.filter(
      (avaliacao) =>
        avaliacao.avaliacao_sga && avaliacao.avaliacao_sga?.qtd_assinaturas > 2,
    )

    const afastamentos =
      await this.vPoliciaisAvaliacoesRepository.buscarPeloPolicial(matricula)

    const anotacoes = await this.anotacoesRepository.buscarPeloPolicial(
      matricula,
    )

    const anotacoesDatasFormatadas = formatarArrayDatas(
      AnotacaoRip.toPlainArray(anotacoes),
    )

    return {
      policial,
      avaliacoes: Avaliacao.toPlainArray(avalicoesAssinadas),
      afastamentos,
      anotacoes: anotacoesDatasFormatadas,
    }
  }
}
