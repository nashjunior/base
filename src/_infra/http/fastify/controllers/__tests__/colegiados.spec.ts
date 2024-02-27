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

type Usuario = {
  matricula: string
  token: string
}

describe('Colegiados (e2e)', () => {
  let appInstance: FastifyInstance
  let datasourceInstance: DataSource
  let usuario_soldado: Usuario
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

    sessoes.push(
      axios.post('https://apis-dev.pm.ce.gov.br/v2/usuarios/sessoes', {
        matricula: process.env.USUARIO_SOLDADO,
        senha: process.env.PASS_USUARIO_SOLDADO,
        sis_sigla: 'segep',
      }),
    )

    const [sessao1, sessao2] = await Promise.all(sessoes)

    usuario_oficial = {
      matricula: sessao1.data.usuario.pes_codigo,
      token: sessao1.data.token,
    }

    usuario_soldado = {
      matricula: sessao2.data.usuario.pes_codigo,
      token: sessao2.data.token,
    }
  }, 30000)

  afterEach(async () => {
    const entities = ['colegiados', 'opms_colegiados']

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

  describe('Criar colegiado controller', () => {
    it('Deveria poder criar uma colegiado', async () => {
      const response2 = await request(appInstance.server)
        .post(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_opm_inicial: 1820,
        })

      expect(response2.statusCode).toBe(201)
      expect(response2.body).toHaveProperty('id_colegiado')
    })

    it('Não deveria poder criar um colegiado sem perfil adequado', async () => {
      const response2 = await request(appInstance.server)
        .post(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_soldado.token)
        .send({
          id_opm_inicial: 1820,
        })

      expect(response2.statusCode).toBe(403)
    })
  })

  describe('Listar colegiados controller', () => {
    it('Deveria poder listar colegiados', async () => {
      await request(appInstance.server)
        .post(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_opm_inicial: 1820,
        })

      await request(appInstance.server)
        .post(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_opm_inicial: 1830,
        })

      const response2 = await request(appInstance.server)
        .get(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_soldado.token)

      expect(response2.statusCode).toBe(200)
      expect(response2.body.itens).toHaveLength(2)
    })
  })

  describe('Mostrar colegiados controller', () => {
    it('Deveria mostrar um colegiado', async () => {
      const response = await request(appInstance.server)
        .post(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_opm_inicial: 1820,
        })

      const response2 = await request(appInstance.server)
        .get(`/colegiados/${response.body.id_colegiado}`)
        .set('Authorization', 'bearer ' + usuario_soldado.token)

      expect(response2.statusCode).toBe(200)
    })
  })

  describe('Atualizar colegiados controller', () => {
    it('Um oficial com perfil padrao não deveria poder atualizar membros do colegiado sem ser presidente', async () => {
      const response = await request(appInstance.server)
        .post(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_opm_inicial: 1830,
        })

      const response2 = await request(appInstance.server)
        .put(`/colegiados/${response.body.id_colegiado}`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .set('Role', 'USUARIO PADRAO')
        .send({
          id_membro_padrao_1: '13444013',
          id_membro_padrao_2: '13444013',
          id_membro_padrao_3: '13444013',
        })
      expect(response2.statusCode).toEqual(400)
      expect(response2.body.message).toEqual(
        'O usuário não tem permissão para usar este serviço.',
      )
    })
  })

  describe('Atualizar membros colegiados controller', () => {
    it('deveria poder atualizar membros do colegiado', async () => {
      const response = await request(appInstance.server)
        .post(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_opm_inicial: 1830,
        })

      const response2 = await request(appInstance.server)
        .put(`/colegiados/${response.body.id_colegiado}/membros`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .set('Role', 'USUARIO PADRAO')
        .send({
          id_membro_padrao_1: '15184213',
          id_membro_padrao_2: '30850912',
          id_membro_padrao_3: '3084811X',
        })

      expect(response2.statusCode).toEqual(200)
    })
  })

  describe('Listar oficiais colegiados', () => {
    it('deveria poder listar oficiais para um colegiado', async () => {
      const response = await request(appInstance.server)
        .post(`/colegiados`)
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .send({
          id_opm_inicial: 1820,
        })

      const response2 = await request(appInstance.server)
        .get(
          `/colegiados/oficiais?colegiado=${response.body.id_colegiado}&pesquisa=123`,
        )
        .set('Authorization', 'bearer ' + usuario_oficial.token)
        .set('Role', 'USUARIO PADRAO')

      expect(response2.statusCode).toEqual(200)
    })
  })
})
