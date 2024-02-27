import { formatarObjetoDatas } from '@/_application/_common/utils/formatarObjetoDatas'

import AppError from '@/_application/_common/errors/app-error'
import { IRecursosRepository } from '@/_domain/avaliacoes/repositories/recursos-repository-interface'
import { PlainRecurso } from '@/_domain/avaliacoes/entities/recurso'

export class MostrarRecursoUsecase {
  constructor(private recursosRepository: IRecursosRepository) {}

  async execute(id_recurso: number): Promise<PlainRecurso> {
    const recurso = await this.recursosRepository.buscarPeloId(id_recurso)

    if (!recurso) {
      throw new AppError(
        'O recurso informado não existe na base de dados.',
        404,
      )
    }

    return formatarObjetoDatas(recurso.toPlainObject())
  }
}
