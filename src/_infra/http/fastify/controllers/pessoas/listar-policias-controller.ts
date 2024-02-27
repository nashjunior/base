import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PessoasPmRepository } from '@/_infra/database/typeorm/repositories/pessoa/pessoas-pm-repository'
import { ListarPoliciaisUsecase } from '@/_application/pessoas/usecases/listar/listar-policiais-usecase'

export async function listarPoliciasController(
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

  const pessoasPmRepository = new PessoasPmRepository()

  const listarOficiais = new ListarPoliciaisUsecase(pessoasPmRepository)

  const resposta = await listarOficiais.execute(pesquisa)

  return response.status(200).send(resposta)
}
