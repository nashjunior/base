import { describe, expect, it, beforeEach, jest } from '@jest/globals'

import { CriarAfastamentosUsecase } from './criar-afastamentos-usecase'
import {
  IBoletim,
  IBoletinsRepository,
} from '@/_domain/boletins/repositories/boletins-repository-interface'
import { Afastamento } from '@/_domain/afastamentos/entities/afastamento'
import { IAfastamentosRepository } from '@/_domain/afastamentos/repositories/afastamentos-repository-interface'
import { AfastamentosInMemoryRepository } from '../../repositories-in-memory/afastamentos-repository-inmemory'
import AppError from '@/_application/_common/errors/app-error'

describe('Criar Afastamento UseCase', () => {
  let criarAfastamentosUseCase: CriarAfastamentosUsecase
  let afastamentosRepository: IAfastamentosRepository
  let boletinsRepositoryMock: Partial<IBoletinsRepository>
  let buscarPeloIdComUnidadeMock: any

  beforeEach(() => {
    afastamentosRepository = new AfastamentosInMemoryRepository()
    buscarPeloIdComUnidadeMock =
      jest.fn<(id: number) => Promise<IBoletim | null>>()
    boletinsRepositoryMock = {
      buscarPeloIdComUnidade: buscarPeloIdComUnidadeMock,
    }

    criarAfastamentosUseCase = new CriarAfastamentosUsecase(
      afastamentosRepository,
      boletinsRepositoryMock as IBoletinsRepository,
    )

    buscarPeloIdComUnidadeMock.mockResolvedValue({
      bol_codigo: 1,
      bol_ano: 2017,
      bol_data: new Date().toISOString(),
      bol_numero: 12,
      pes_unidade: '1223',
    })
  })

  it('Deveria poder criar um afastamento', async () => {
    const afastamento = await criarAfastamentosUseCase.execute({
      id_tipo_afastamento: 1,
      atualizado_por: '13444013',
      bol_codigo: 1,
      criado_por: '13444013',
      data_final: new Date(2022, 1, 1, 0, 0, 0),
      data_inicial: new Date(2022, 1, 1, 0, 0, 0),
      id_policial: '11111111',
      observacao: 'çlk~çlk~çlk~çlk~çlk~çlk',
    })

    expect(afastamento).toHaveProperty('id_afastamento')
    expect(afastamento).toBeInstanceOf(Afastamento)
  })

  it('Não deveria poder criar um afastamento com boletim invalido', async () => {
    buscarPeloIdComUnidadeMock.mockResolvedValue(null)

    try {
      await criarAfastamentosUseCase.execute({
        id_tipo_afastamento: 1,
        atualizado_por: '13444013',
        bol_codigo: 1,
        criado_por: '13444013',
        data_final: new Date(2022, 1, 1, 0, 0, 0),
        data_inicial: new Date(2022, 1, 1, 0, 0, 0),
        id_policial: '11111111',
        observacao: 'çlk~çlk~çlk~çlk~çlk~çlk',
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toBe(
        'O boletim informado não existe na base de dados.',
      )
    }
  })

  it('Não deveria poder criar um afastamento com data inicial maior que final', async () => {
    try {
      await criarAfastamentosUseCase.execute({
        id_tipo_afastamento: 1,
        atualizado_por: '13444013',
        bol_codigo: 1,
        criado_por: '13444013',
        data_final: new Date(2022, 1, 1, 0, 0, 0),
        data_inicial: new Date(2022, 2, 1, 0, 0, 0),
        id_policial: '11111111',
        observacao: 'çlk~çlk~çlk~çlk~çlk~çlk',
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Data final deve ser maior que data inicial.')
    }
  })
})
