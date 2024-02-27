import fs from 'fs'
import util from 'node:util'
import Path from 'path'
import { pipeline } from 'node:stream'

import { MultipartFile } from '@fastify/multipart'

import { IPessoa } from '@/_domain/pessoas/repositories/pessoas-repository-interface'
import { IPessoasPmRepository } from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'
import { IRecursosRepository } from '@/_domain/avaliacoes/repositories/recursos-repository-interface'
import AppError from '@/_application/_common/errors/app-error'
import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'
import { ITermosRespostasRecursosRepository } from '@/_domain/avaliacoes/repositories/termos-respostas-recursos-repository-interface'
import { INotasAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/notas-avaliacoes-repository-interface'
import { CriarRespostaComissaoDocumentoSGAService } from '../../services/criar-resposta-comissao-documento-sga-service'
import {
  EnumStatusRecurso,
  Recurso,
} from '@/_domain/avaliacoes/entities/recurso'
import { NotasAvaliacao } from '@/_domain/avaliacoes/entities/notas-avaliacao'
import {
  EnumInstanciaRecurso,
  TermoRespostaRecurso,
} from '@/_domain/avaliacoes/entities/termo-resposta-recurso'
import {
  Avaliacao,
  EnumStatusAvaliacao,
} from '@/_domain/avaliacoes/entities/avaliacao'

export interface Input {
  id_recurso: number
  resposta_comissao: string
  respondido_comissao_por: string
  deferido: boolean
  file?: MultipartFile
  tamanhoArquivo: number
  atitude_pontos?: number
  capacidade_pontos?: number
  comprometimento_pontos?: number
  disciplina_pontos?: number
  eficiencia_pontos?: number
  assiduidade_pontos?: number
  etica_pontos?: number
  pontualidade_pontos?: number
  proatividade_pontos?: number
  produtividade_pontos?: number
  token: string
}

export class ResponderRecursosComissaoUsecase {
  constructor(
    private recursosRepository: IRecursosRepository,
    private avaliacoesRepository: IAvaliacoesRepository,
    private criarRespostaService: CriarRespostaComissaoDocumentoSGAService,
    private termoTermoRespostaRepository: ITermosRespostasRecursosRepository,
    private notasRepository: INotasAvaliacoesRepository,
    private pessoasPmRepository: IPessoasPmRepository,
  ) {}

  async execute(input: Input): Promise<Recurso> {
    let mensagemErro = 'Ocorreu um erro ao tentar responder o recurso'
    let statusCode = 400
    const pathDocumentos = Path.resolve('documentos')
    const ano = new Date().getFullYear()
    const fullPath = Path.join(pathDocumentos, String(ano), 'recursos')
    const pathFileRecurso = input.file
      ? Path.join(String(ano), 'recursos', input.file.filename)
      : null
    const recurso = await this.recursosRepository.buscarPeloId(input.id_recurso)

    try {
      if (!recurso) {
        mensagemErro = 'O recurso informado não existe na base de dados.'
        statusCode = 404
        throw Error()
      }

      const avaliacaoExiste =
        await this.avaliacoesRepository.buscarPeloIdComNotasTermoColegiado(
          recurso.id_avaliacao,
        )

      if (!avaliacaoExiste) {
        mensagemErro = 'A avaliação informada não existe na base de dados.'
        statusCode = 404
        throw Error()
      }

      const { colegiado, notas, pessoa_avaliado, ...rest } = avaliacaoExiste

      if (!colegiado?.id_membro_padrao_1) {
        throw new AppError('O colegiado não tem definido o membro 1', 400)
      }

      if (!colegiado?.id_membro_padrao_2) {
        throw new AppError('O colegiado não tem definido o membro 2', 400)
      }

      if (!colegiado?.id_membro_padrao_3) {
        throw new AppError('O colegiado não tem definido o membro 3', 400)
      }

      const membro1 =
        await this.pessoasPmRepository.buscarPeloIdComPessoaEGraduacao(
          colegiado?.id_membro_padrao_1.valor,
        )

      if (!membro1) {
        throw new AppError(
          'O presidente da avaliação não existe na base de dados.',
          404,
        )
      }

      const membro2 =
        await this.pessoasPmRepository.buscarPeloIdComPessoaEGraduacao(
          colegiado?.id_membro_padrao_2.valor,
        )

      if (!membro2) {
        throw new AppError(
          'O membro 2 da avaliação não existe na base de dados.',
          404,
        )
      }

      const membro3 =
        await this.pessoasPmRepository.buscarPeloIdComPessoaEGraduacao(
          colegiado?.id_membro_padrao_3.valor,
        )

      if (!membro3) {
        throw new AppError(
          'O membro 3 da avaliação não existe na base de dados.',
          404,
        )
      }

      const avaliacaoMergeada = new Avaliacao({
        ...rest,
        id_avaliacao: avaliacaoExiste.id_avaliacao,
        status: input.deferido
          ? EnumStatusAvaliacao.CONCLUIDA
          : EnumStatusAvaliacao.CGP_RECURSO,
        id_colegiado: avaliacaoExiste.id_colegiado,
        criado_por: avaliacaoExiste.criado_por.valor,
        criado_em: avaliacaoExiste.criado_em,
        avaliado: avaliacaoExiste.avaliado.valor,
        avaliado_opm_na_epoca: avaliacaoExiste.avaliado_opm_na_epoca,
        numero: avaliacaoExiste.numero,
        atualizado_por: input.respondido_comissao_por,
        atualizado_em: new Date(),
        deletado_por: null,
        deletado_em: null,
      })

      await this.avaliacoesRepository.atualizar(avaliacaoMergeada)

      let notasAtuais = notas ? notas[0] : ({} as NotasAvaliacao)

      if (input.deferido) {
        notasAtuais = notas
          ? new NotasAvaliacao({
              ...notas[0].toPlainObject(),
              assiduidade_pontos: input.assiduidade_pontos || 0,
              atitude_pontos: input.atitude_pontos || 0,
              capacidade_pontos: input.capacidade_pontos || 0,
              comprometimento_pontos: input.comprometimento_pontos || 0,
              disciplina_pontos: input.disciplina_pontos || 0,
              eficiencia_pontos: input.eficiencia_pontos || 0,
              etica_pontos: input.etica_pontos || 0,
              pontualidade_pontos: input.pontualidade_pontos || 0,
              proatividade_pontos: input.proatividade_pontos || 0,
              produtividade_pontos: input.produtividade_pontos || 0,
            })
          : ({} as NotasAvaliacao)

        await this.notasRepository.marcarComoAntiga(notasAtuais)
        const notasCriar = new NotasAvaliacao({
          ...notasAtuais.toPlainObject(),
          id_notas_avaliacao: undefined,
          criado_por: input.respondido_comissao_por,
          atualizado_por: input.respondido_comissao_por,
          id_avaliacao: avaliacaoExiste.id_avaliacao!,
          atual: true,
          fase_alteracao: EnumStatusAvaliacao.COMISSAO_RECURSO,
          criado_em: new Date(),
          atualizado_em: new Date(),
        })
        notasAtuais = await this.notasRepository.criar(notasCriar)
      }

      const recursoMergeado = new Recurso({
        ...recurso.toPlainObject(),
        resposta_comissao: input.resposta_comissao,
        status: input.deferido
          ? EnumStatusRecurso.ENCERRADO
          : EnumStatusRecurso.ABERTO_CGP,
        respondido_comissao_por: input.respondido_comissao_por,
        respondido_comissao_em: new Date(),
        path_documento_comissao: pathFileRecurso,
        deferido_comissao: input.deferido,
      })

      const recursoAtualizado = await this.recursosRepository.atualizar(
        recursoMergeado,
      )
      let fullPathFilename = null
      if (input.file && input.file.file) {
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true })
        }
        fullPathFilename = Path.join(fullPath, input.file.filename)

        const pump = util.promisify(pipeline)

        await pump(input.file.file, fs.createWriteStream(fullPathFilename))
        if (input.file.file.truncated) {
          mensagemErro = `O tamanho máximo do arquivo deve ser ${input.tamanhoArquivo} MBytes.`
          statusCode = 404
          throw Error()
        }
      }

      const termoCriar = new TermoRespostaRecurso({
        id_recurso: recurso.id_recurso!,
        criado_em: new Date(),
        instancia: EnumInstanciaRecurso.COMISSAO,
      })

      const termo = await this.termoTermoRespostaRepository.criar(termoCriar)

      await this.criarRespostaService.execute({
        avaliacao: avaliacaoExiste,
        notas: notasAtuais,
        termo,
        recurso: recursoAtualizado,
        membro1,
        membro2,
        membro3,
        avaliado: pessoa_avaliado as IPessoa,
        token: input.token,
        pathAnexoComissao: fullPathFilename,
      })

      return recursoAtualizado
    } catch (error: any) {
      if (mensagemErro === 'Ocorreu um erro ao tentar responder o recurso') {
        statusCode = 500
        console.error(error)
      }

      throw new AppError(mensagemErro, statusCode, error.message)
    }
  }
}
