import { env } from '@/env'

import { FastifyReply, FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'
import removeAccents from 'remove-accents'
interface ITokenPayload {
  iad: number
  exp: number
  sub: string
}

export async function verificaAutenticacao(
  request: FastifyRequest,
  response: FastifyReply,
) {
  if (request.url === '/usuarios/sessoes') return
  if (request.url.startsWith('/externo')) return
  let mensagemErro = ''
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      mensagemErro = 'JWT token está faltando'
      throw Error()
    }

    const [, token] = authHeader.split(' ')
    let subResult
    try {
      const decoded = verify(token, env.JWT_SECRET_PUBLIC)

      const { sub } = decoded as ITokenPayload
      subResult = sub
    } catch (error) {
      mensagemErro = 'JWT inválido'
      throw Error()
    }

    const userInfo = JSON.parse(subResult)

    request.headers.user = userInfo.id_usuario

    const perfis = userInfo.perfis.map((perf: string) => removeAccents(perf))

    request.headers.roles = JSON.stringify(perfis)
    request.headers.role = request.headers.role
      ? removeAccents(request.headers.role as string)
      : undefined

    const roleHeader = (request.headers.role as string) || undefined

    if (roleHeader) {
      if (!perfis.includes(roleHeader)) {
        mensagemErro = 'Perfil inválido'
        throw Error()
      }
    }
  } catch (err) {
    return response.status(401).send({ message: mensagemErro })
  }
}
