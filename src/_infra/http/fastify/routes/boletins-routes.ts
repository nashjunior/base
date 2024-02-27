import { FastifyInstance } from 'fastify'

import { listarBoletinsController } from '../controllers/boletins/listar-boletins-controller'

export async function boletinsRoutes(app: FastifyInstance) {
  app.get('/', listarBoletinsController)
}
