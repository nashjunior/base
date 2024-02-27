import { getAppInstance } from '@/_infra/http/fastify/app-fastify'
import request from 'supertest'
import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals'
import { FastifyInstance } from 'fastify'
import { DataSource } from 'typeorm'
import axios from 'axios'
import { EnumSubTipoAfastamento } from '@/_domain/afastamentos/entities/tipo-afastamento'

type Usuario = {
  matricula: string
  token: string
}

describe('Afastamentos (e2e)', () => {
  let appInstance: FastifyInstance
  let datasourceInstance: DataSource
  let usuario_oficial: Usuario
  beforeAll(async () => {
    const { app, datasource } = await getAppInstance()
    appInstance = app
    datasourceInstance = datasource
    await datasourceInstance.runMigrations()

    await appInstance.ready()
    const sessoes: any[] = []
    sessoes.push(
      axios.post('https://apis-dev.pm.ce.gov.br/v2/usuarios/sessoes', {
        matricula: process.env.USUARIO_OFICIAL,
        senha: process.env.PASS_USUARIO_OFICIAL,
        sis_sigla: 'segep',
      }),
    )

    const [sessao1] = await Promise.all(sessoes)

    usuario_oficial = {
      matricula: sessao1.data.usuario.pes_codigo,
      token: sessao1.data.token,
    }
  }, 30000)

  afterEach(async () => {
    const entities = ['afastamentos']

    const queries: any[] = []

    for (const entity of entities) {
      queries.push(
        datasourceInstance.query(`TRUNCATE TABLE segep_test.${entity} CASCADE`),
      )
    }

    await Promise.all(queries)
  })

  afterAll(async () => {
    await appInstance.close()

    await datasourceInstance.destroy()
  })

  describe('Criar afastamento controller', () => {
    it('Deveria poder criar um afastamento', async () => {
      const response2 = await request(appInstance.server)
        .post(`/afastamentos`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_tipo_afastamento: 1,
          id_policial: '13444013',
          data_inicial: new Date(2022, 4, 5),
          data_final: new Date(2022, 5, 5),
          observacao: 'teste',
          bol_codigo: 55,
        })

      expect(response2.statusCode).toBe(201)
      expect(response2.body).toHaveProperty('id_afastamento')
    })
  })

  describe('Criar tipos de afastamentos controller', () => {
    it('Deveria poder criar um tipo de afastamento individual', async () => {
      const response2 = await request(appInstance.server)
        .post(`/afastamentos/tipos`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          subtipo: EnumSubTipoAfastamento.INDIVIDUAL,
          descricao: 'tipo teste',
        })

      await datasourceInstance.query(
        `DELETE FROM segep_test.tipos_afastamentos where id_tipo_afastamento=${response2.body.id_tipo_afastamento}`,
      )

      expect(response2.statusCode).toBe(201)
      expect(response2.body).toHaveProperty('id_tipo_afastamento')
    })
  })

  describe('listar afastamentos controller', () => {
    it('Deveria poder listar afastamentos', async () => {
      const response2 = await request(appInstance.server)
        .get(`/afastamentos`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)

      expect(response2.statusCode).toBe(200)
    })
  })

  describe('listar afastamentos policial controller', () => {
    it('Deveria poder listar afastamentos de um policial', async () => {
      await request(appInstance.server)
        .post(`/afastamentos`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_tipo_afastamento: 1,
          id_policial: '13444013',
          data_inicial: new Date(2022, 4, 5),
          data_final: new Date(2022, 5, 5),
          observacao: 'teste',
          bol_codigo: 55,
        })
      const response2 = await request(appInstance.server)
        .get(`/afastamentos/13444013`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)

      expect(response2.statusCode).toBe(200)
    })
  })
})
