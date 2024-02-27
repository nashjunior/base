import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { VBoletinsRepository } from '@/_infra/database/typeorm/repositories/boletins/v-boletins-repository'
import { ListarBoletinsUsecase } from '@/_application/boletins/usecases/listar-boletins-usecase'

export async function listarBoletinsController(
  request: FastifyRequest,
  response: FastifyReply,
): Promise<any> {
  const { pesquisa } = request.query as any

  const querySchema = z.object({
    pesquisa: z.string({
      required_error: 'A propriedade pesquisar é requerida como query params',
    }),
  })

  const validacao = querySchema.safeParse(request.query)

  if (validacao.success === false) {
    const error = validacao.error

    return response.status(400).send({
      message: error.name,
      error,
    })
  }

  const vBoletinsRepository = new VBoletinsRepository()

  const listarBoletins = new ListarBoletinsUsecase(vBoletinsRepository)

  const resposta = await listarBoletins.execute(pesquisa)

  return response.status(200).send(resposta)
}
