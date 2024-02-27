import 'reflect-metadata'

import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

import { ZodError } from 'zod'
import { env } from '@/env'
import { AppDataSource } from '@/_infra/database/typeorm'

import { appRoutes } from './routes'
import fastifyCookie from '@fastify/cookie'
import { DataSource } from 'typeorm'

import fastifyMultipart from '@fastify/multipart'
import { verificaAutenticacao } from './middlewares/verifica-autenticacao'

import path from 'path'

import AppError from '@/_application/_common/errors/app-error'

interface ReturnInit {
  app: FastifyInstance
  datasource: DataSource
}

export async function getAppInstance(): Promise<ReturnInit> {
  await AppDataSource.initialize()
  const appFastify = fastify()

  await appFastify.register(cors, {
    origin: true,
  })

  appFastify.register(fastifyCookie)
  appFastify.register(fastifyMultipart, {
    // attachFieldsToBody: true,   não vou usar esta opcao para poder usar stream, se colocar esta opcao
    // tenho quer usar toBuffer e vou carregar o arquivo em memória
  })
  appFastify.register(require('@fastify/static'), {
    root: path.resolve('documentos'),
  })
  appFastify.addHook('onRequest', verificaAutenticacao)

  appFastify.register(appRoutes)

  appFastify.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })
    }
    if (error instanceof AppError) {
      const objetoResponse = { message: error.message }

      return reply.status(error.statusCode).send(objetoResponse)
    }

    if (env.NODE_ENV !== 'production') {
      console.error('erro: ', error)
    } else {
      // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
    }

    return reply.status(500).send({
      message: 'Ocorreu um erro no servidor SEGEP.',
      error: error.message,
      stack: error.stack ? error.stack.substring(0, 400) : undefined,
    })
  })

  return { app: appFastify, datasource: AppDataSource }
}
