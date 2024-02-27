import { MultipartFile } from '@fastify/multipart'
import { pipeline } from 'node:stream'
import fs from 'fs'
import util from 'node:util'
import Path from 'path'

import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'
import { IRecursosRepository } from '@/_domain/avaliacoes/repositories/recursos-repository-interface'
import { IHistoricoStatusAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/historico-status-avaliacoes-repository-interface'
import AppError from '@/_application/_common/errors/app-error'
import {
  EnumStatusRecurso,
  PlainRecurso,
  Recurso,
} from '@/_domain/avaliacoes/entities/recurso'
import {
  Avaliacao,
  EnumStatusAvaliacao,
} from '@/_domain/avaliacoes/entities/avaliacao'
import { HistoricoStatusAvaliacao } from '@/_domain/avaliacoes/entities/historico-status-avaliacao'

export interface Input {
  id_avaliacao: number
  descricao: string
  file?: MultipartFile
  tamanhoArquivo: number
}

export class CriarRecursosUsecase {
  constructor(
    private recursosRepository: IRecursosRepository,
    private avaliacoesRepository: IAvaliacoesRepository,
    private historicoStatusAvaliacoesRepository: IHistoricoStatusAvaliacoesRepository,
  ) {}

  async execute(input: Input): Promise<PlainRecurso> {
    let mensagemErro = 'Ocorreu um erro ao tentar criar o recurso'
    let statusCode = 400
    try {
      const pathDocumentos = Path.resolve('documentos')
      const ano = new Date().getFullYear()
      const fullPath = Path.join(pathDocumentos, String(ano), 'recursos')
      const pathFileRecurso = input.file
        ? Path.join(String(ano), 'recursos', input.file.filename)
        : null

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
      }
      const avaliacaoExiste = await this.avaliacoesRepository.buscarPeloId(
        input.id_avaliacao,
      )

      if (!avaliacaoExiste) {
        mensagemErro = 'A avaliação informada não existe na base de dados.'
        statusCode = 404
        throw Error()
      }

      if (
        avaliacaoExiste.avaliacao_sga &&
        avaliacaoExiste.avaliacao_sga.qtd_assinaturas < 3
      ) {
        mensagemErro =
          'A avaliação informada ainda não foi assinada pela comissão.'
        throw Error()
      }

      if (
        avaliacaoExiste.termo_sga &&
        avaliacaoExiste.termo_sga.dias_restantes_recurso < 1
      ) {
        mensagemErro = 'O prazo para abertura de recurso já se encerrou!'
        throw Error()
      }

      const recursoJaExiste = await this.recursosRepository.buscarPelaAvaliacao(
        input.id_avaliacao,
      )

      if (recursoJaExiste) {
        mensagemErro = 'A avaliação informada já possui recurso.'
        throw Error()
      }

      const recursoCriar = new Recurso({
        path_documento: pathFileRecurso,
        status: EnumStatusRecurso.ABERTO_COMISSAO,
        criado_em: new Date(),
        id_avaliacao: input.id_avaliacao,
        descricao: input.descricao,
        respondido_comissao_por: null,
        deferido_cgp: null,
        deferido_comissao: null,
        deletado_em: null,
        deletado_por: null,
        id_membro_cgp_1: null,
        id_membro_cgp_2: null,
        id_membro_cgp_3: null,
        id_posto_membro1_na_epoca: null,
        id_posto_membro2_na_epoca: null,
        id_posto_membro3_na_epoca: null,
        path_documento_cgp: null,
        path_documento_comissao: null,
        respondido_cgp_em: null,
        respondido_cgp_por: null,
        respondido_comissao_em: null,
        resposta_cgp: null,
        resposta_comissao: null,
      })

      const recurso = await this.recursosRepository.criar(recursoCriar)

      const avaliacaoMergeada = new Avaliacao({
        status: EnumStatusAvaliacao.COMISSAO_RECURSO,
        atualizado_em: new Date(),
        atualizado_por: avaliacaoExiste.avaliado.valor,
        avaliado: avaliacaoExiste.avaliado.valor,
        avaliado_opm_na_epoca: avaliacaoExiste.avaliado_opm_na_epoca,
        criado_em: avaliacaoExiste.criado_em,
        criado_por: avaliacaoExiste.criado_por.valor,
        deletado_em: null,
        deletado_por: null,
        id_colegiado: avaliacaoExiste.id_colegiado,
        numero: avaliacaoExiste.numero,
        id_avaliacao: avaliacaoExiste.id_avaliacao,
      })

      await this.avaliacoesRepository.atualizar(avaliacaoMergeada)

      const historicoStatusCriar = new HistoricoStatusAvaliacao({
        status: EnumStatusAvaliacao.COMISSAO_RECURSO,
        criado_por: avaliacaoExiste.avaliado.valor,
        id_avaliacao: avaliacaoExiste.id_avaliacao!,
        criado_em: new Date(),
      })

      await this.historicoStatusAvaliacoesRepository.criar(historicoStatusCriar)

      if (input.file && input.file.file) {
        const fullPathFilename = Path.join(fullPath, input.file.filename)

        const pump = util.promisify(pipeline)

        await pump(input.file.file, fs.createWriteStream(fullPathFilename))
        if (input.file.file.truncated) {
          mensagemErro = `O tamanho máximo do arquivo deve ser ${input.tamanhoArquivo} MBytes.`
          statusCode = 404
          throw Error()
        }
      }

      return recurso.toPlainObject()
    } catch (error: any) {
      if (mensagemErro === 'Ocorreu um erro ao tentar criar o recurso') {
        statusCode = 500
        console.error(error)
      }

      throw new AppError(mensagemErro, statusCode, error.message)
    }
  }
}
