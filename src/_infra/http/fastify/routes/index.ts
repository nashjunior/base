import { FastifyInstance } from 'fastify'
import { publicRoutes } from './public-routes'

import { pessoasRoutes } from './pessoas-routes'

import { boletinsRoutes } from './boletins-routes'
import { documentosRoutes } from './documentos-routes'
import { utilsRoutes } from './utils-routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(pessoasRoutes, { prefix: 'pessoas' })
  app.register(publicRoutes, { prefix: 'public' })
  app.register(boletinsRoutes, { prefix: 'boletins' })
  app.register(documentosRoutes, { prefix: 'documentos' })
  app.register(utilsRoutes, { prefix: 'utils' })
}
