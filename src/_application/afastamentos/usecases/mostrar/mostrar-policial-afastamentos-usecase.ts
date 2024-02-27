import AppError from '@/_application/_common/errors/app-error'
import { formatarArrayDatas } from '@/_application/_common/utils/formatarArrayDatas'
import { IVPoliciaisAfastamentosRepository } from '@/_domain/afastamentos/repositories/v-policiais-afastamentos-repository-interface'
import { IPessoasPmRepository } from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'

export class MostrarPolicialAfastamentosUsecase {
  constructor(
    private pessoasPmRepository: IPessoasPmRepository,
    private vPoliciaisAvaliacoesRepository: IVPoliciaisAfastamentosRepository,
  ) {}

  async execute(matricula: string): Promise<any> {
    const policial =
      await this.pessoasPmRepository.buscarPeloIdComAvalicaoSituacao(matricula)

    if (!policial) {
      throw new AppError(
        'O policial informado não foi encontrado na base de dados.',
        404,
      )
    }

    const afastamentos =
      await this.vPoliciaisAvaliacoesRepository.buscarPeloPolicial(matricula)

    const afastamentosDatasFormatadas = formatarArrayDatas(afastamentos)

    return {
      policial,
      afastamentos: afastamentosDatasFormatadas,
    }
  }
}
