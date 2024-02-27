import 'dotenv/config'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const JWT_SECRET_PUBLIC = fs.readFileSync(path.resolve('public.key'))

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production', 'migration']).default('dev'),
  SERVER_PORT: z.coerce.number().default(3333),
  ID_SISTEMA: z.coerce.number(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  PATH_MIGRATIONS: z.string(),
  JWT_EXPIRES_IN: z.string(),
  URL_API_MAIL: z.string(),
  URL_API_SGA: z.string(),
  TOKEN_API_MAIL: z.string(),
  RULE_JOB_NOTIFICACAO_AVALIACAO: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error(
    '❌ Alguma variável de ambiente está faltando',
    _env.error.format(),
  )

  throw new Error('Alguma variável de ambiente está faltando.')
}

if (!JWT_SECRET_PUBLIC) {
  throw new Error('private.key e public.key devem estar na raiz do projeto.')
}

export const env = { ..._env.data, JWT_SECRET_PUBLIC }
