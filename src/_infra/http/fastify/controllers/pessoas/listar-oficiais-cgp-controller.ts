import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { VOficiaisCGPRepository } from '@/_infra/database/typeorm/repositories/pessoa/v-oficiais-cgp-repository'
import { ListarOficiaisCGPUsecase } from '@/_application/pessoas/usecases/listar/listar-oficiais-cgp-usecase'

export async function listarOficiaisCGPController(
  request: FastifyRequest,
  response: FastifyReply,
): Promise<any> {
  const { pesquisa } = request.query as any

  const bodySchema = z.object({
    pesquisa: z
      .string()
      .min(1, 'O parâmetro pesquisa deve constar como parâmetro de consulta'),
  })

  const validacao = bodySchema.safeParse(request.query)

  if (validacao.success === false) {
    const error = validacao.error.formErrors.fieldErrors

    return response.status(400).send({
      message: error,
      error,
    })
  }
  const vcolegiadosOficiaisRepository = new VOficiaisCGPRepository()
  const listarOficiais = new ListarOficiaisCGPUsecase(
    vcolegiadosOficiaisRepository,
  )
  const resposta = await listarOficiais.execute({
    pesquisa,
  })

  return response.status(200).send(resposta)
}
