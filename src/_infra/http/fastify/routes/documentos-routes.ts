import { FastifyInstance, FastifyRequest } from 'fastify'

export async function documentosRoutes(app: FastifyInstance) {
  app.get('/*', function (req: FastifyRequest, reply: any) {
    const filepath = req.params as any

    reply.sendFile(filepath['*'])
  })
}
