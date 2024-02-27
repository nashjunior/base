import { DataSource } from 'typeorm'
import { env } from '@/env'
import { Graduacao } from './models/pessoa/graduacao'
import { Grupo } from './models/seguranca/grupo'
import { GrupoUsuario } from './models/seguranca/grupo-usuario'
import { Sistema } from './models/seguranca/sistema'
import { Usuario } from './models/seguranca/usuario'
import { PessoaCivil } from './models/pessoa/pessoa-civil'
import { PessoaPm } from './models/pessoa/pessoa-pm'
import { Pessoa } from './models/pessoa/pessoa'
import { Unidade } from './models/pessoa/unidade'
import { VOpmAtual } from './models/pessoa/v-opm-atual'
import { SituacaoPm } from './models/pessoa/situacao-pm'
import { UsuarioUnidade } from './models/seguranca/usuario-unidade'
import { Boletim } from './models/boletim/boletim'
import { PmSituacao } from './models/pessoa/pm-situacao'
import { VBoletim } from './models/boletim/v-boletim'

const PORT = Number(env.DB_PORT)

const isTestEnvironment = process.env.NODE_ENV === 'test'

export const AppDataSource = new DataSource({
  type: 'postgres',
  schema: isTestEnvironment ? 'escalas_ordinarias_test' : 'escalas_ordinarias',
  host: env.DB_HOST || 'localhost',
  port: PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  logging: false,
  migrations: [env.PATH_MIGRATIONS],
  entities: [
    Graduacao,
    Grupo,
    GrupoUsuario,
    Sistema,
    Usuario,
    PessoaCivil,
    PessoaPm,
    Pessoa,
    Unidade,
    VOpmAtual,
    SituacaoPm,
    UsuarioUnidade,
    Boletim,
    PmSituacao,
    VBoletim,
  ],
})
