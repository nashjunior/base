import { PlainAfastamento } from '@/_domain/afastamentos/entities/afastamento'
import { IAfastamentosRepository } from '@/_domain/afastamentos/repositories/afastamentos-repository-interface'

export class ListarAfastamentosPolicialUsecase {
  constructor(private afastamentosRepository: IAfastamentosRepository) {}

  async execute(matricula: string): Promise<PlainAfastamento[]> {
    const afastamentos = await this.afastamentosRepository.buscarPeloPolicial(
      matricula,
    )

    return afastamentos.map((afastamento) => afastamento.toPlainObject())
  }
}
