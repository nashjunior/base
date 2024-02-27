import { MostrarImagemPolicialUsecase } from '@/_application/pessoas/usecases/mostrar/mostrar-imagem-policial-usecase'
import { PessoasPmRepository } from '@/_infra/database/typeorm/repositories/pessoa/pessoas-pm-repository'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function mostarImagemPolicialController(
  request: FastifyRequest,
  response: FastifyReply,
): Promise<any> {
  const { matricula } = request.params as any

  const mostrarImagemPolicialUsecase = new MostrarImagemPolicialUsecase(
    new PessoasPmRepository(),
  )
  const resposta = await mostrarImagemPolicialUsecase.execute(matricula)

  return response.status(200).send(resposta)
}
