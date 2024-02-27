import { FastifyInstance } from 'fastify'

import { listarOficiaisController } from '../controllers/pessoas/listar-oficiais-controller'
import { mostarImagemPolicialController } from '../controllers/pessoas/mostrar-imagem-policial-controller'
import { listarSoldadosController } from '../controllers/pessoas/listar-soldados-controller'
import { listarPoliciasController } from '../controllers/pessoas/listar-policias-controller'
import { listarOficiaisCGPController } from '../controllers/pessoas/listar-oficiais-cgp-controller'

export async function pessoasRoutes(app: FastifyInstance) {
  app.get('/oficiais/cgp', listarOficiaisCGPController)
  app.get('/oficiais', listarOficiaisController)
  app.get('/policiais', listarPoliciasController)
  app.get('/soldados', listarSoldadosController)
  app.get('/imagem/:matricula', mostarImagemPolicialController)
}
