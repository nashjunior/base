import { IVBoletinsRepository } from '@/_domain/boletins/repositories/v-boletins-repository-interface'

export class ListarBoletinsUsecase {
  constructor(private vBoletinsRepository: IVBoletinsRepository) {}
  async execute(input: string): Promise<any[]> {
    const oficiais = await this.vBoletinsRepository.buscarPelaPesquisa(input)

    return oficiais
  }
}
