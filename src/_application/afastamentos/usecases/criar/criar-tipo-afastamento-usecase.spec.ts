import { describe, expect, it, beforeEach } from '@jest/globals'

import { CriarTipoAfastamentosUsecase } from './criar-tipo-afastamento-usecase'
import { ITiposAfastamentosRepository } from '@/_domain/afastamentos/repositories/tipos-afastamentos-repository-interface'
import { TiposAfastamentosInMemoryRepository } from '../../repositories-in-memory/tipos-afastamentos-repository-inmemory'
import {
  EnumSubTipoAfastamento,
  TipoAfastamento,
} from '@/_domain/afastamentos/entities/tipo-afastamento'
import AppError from '@/_application/_common/errors/app-error'

describe('Criar Tipo Afastamento UseCase', () => {
  let usecase: CriarTipoAfastamentosUsecase
  let tiposAfastamentosRepository: ITiposAfastamentosRepository

  beforeEach(() => {
    tiposAfastamentosRepository = new TiposAfastamentosInMemoryRepository()

    usecase = new CriarTipoAfastamentosUsecase(tiposAfastamentosRepository)
  })

  it('Deveria poder criar um tipo de afastamento', async () => {
    const resultado = await usecase.execute({
      atualizado_por: '13444013',
      criado_por: '13444013',
      descricao: 'tipo afastamento 1',
      subtipo: EnumSubTipoAfastamento.INDIVIDUAL,
    })

    expect(resultado).toHaveProperty('id_tipo_afastamento')
    expect(resultado).toBeInstanceOf(TipoAfastamento)
  })

  it('Não deveria poder criar um tipo de afastamento com subtipo invalido', async () => {
    try {
      await usecase.execute({
        atualizado_por: '13444013',
        criado_por: '13444013',
        descricao: 'tipo afastamento 1',
        subtipo: 'outro' as any,
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Subtipo inválido.')
    }
  })

  it('Não deveria poder criar um tipo de afastamento com mesma descriçao', async () => {
    try {
      await usecase.execute({
        atualizado_por: '13444013',
        criado_por: '13444013',
        descricao: 'tipo afastamento 1',
        subtipo: EnumSubTipoAfastamento.INDIVIDUAL,
      })
      await usecase.execute({
        atualizado_por: '13444013',
        criado_por: '13444013',
        descricao: 'tipo afastamento 1',
        subtipo: EnumSubTipoAfastamento.INDIVIDUAL,
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toBe('Tipo já existe na base de dados.')
    }
  })
})
