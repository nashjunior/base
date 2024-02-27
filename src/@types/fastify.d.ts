import 'fastify'
declare module 'fastify' {
  export interface FastifyRequest {
    role: string
    roles: string
    user: string // substitua 'User' pelo tipo real do usuário
  }
}
