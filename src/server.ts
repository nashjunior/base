import { getAppInstance } from './_infra/http/fastify/app-fastify'

import { env } from './env'
import { DataSource } from 'typeorm'

let server: any
let datasourceInstanced: DataSource

getAppInstance().then(({ app, datasource }) => {
  server = app
  datasourceInstanced = datasource
  app
    .listen({
      host: '0.0.0.0',
      port: env.SERVER_PORT,
    })
    .then(() => {
      console.log(`🎉 O servidor está rodando na porta ${env.SERVER_PORT} 🎉`)
    })
})

async function stop() {
  await server.close()
  console.log('✅ Servidor encerrado com sucesso.')

  await datasourceInstanced.destroy()
  console.log('✅ Conexão do TypeORM encerrada com sucesso.')

  process.exit(0)
}

process.on('SIGINT', async () => {
  console.log('Parada do serviço iniciada.')
  await stop()
})
