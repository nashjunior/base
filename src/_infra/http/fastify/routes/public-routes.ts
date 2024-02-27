import { FastifyInstance } from 'fastify'

export async function publicRoutes(app: FastifyInstance) {
  app.get('/test', (req, res) => {
    res.send('ok')
  })
}
