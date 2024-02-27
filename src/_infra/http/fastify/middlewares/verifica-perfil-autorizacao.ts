import { FastifyReply, FastifyRequest } from 'fastify'

export function verificaPerfilAutorizacao(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.headers.roles) {
      return reply
        .status(404)
        .send({ message: 'Não há header roles na requisição' })
    }

    const perfis = JSON.parse(String(request.headers.roles))

    const roleHeader = (request.headers.role as string) || undefined

    if (roleHeader) {
      if (!perfis.includes(roleHeader)) {
        return reply
          .status(404)
          .send({ message: 'Não há header role na requisição' })
      }
    }

    if (!perfis.some((perfil: string) => roles.includes(perfil))) {
      return reply.status(403).send({ message: 'usuário não autorizado.' })
    }
  }
}
