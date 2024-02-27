import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function utilsRoutes(app: FastifyInstance) {
  app.get(
    '/data-hora-atuais',
    (request: FastifyRequest, response: FastifyReply) => {
      const agora = new Date()

      const ano = agora.getFullYear()
      const mes = agora.getMonth() + 1
      const dia = agora.getDate()
      const hora = agora.getHours()
      const minutos = agora.getMinutes()

      return response.status(201).send({ ano, mes, dia, hora, minutos })
    },
  )
}
