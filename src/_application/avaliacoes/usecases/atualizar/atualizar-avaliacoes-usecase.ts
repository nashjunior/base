import { IPessoasPmRepository } from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'
import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'
import { IVAvaliacoesSgaRepository } from '@/_domain/avaliacoes/repositories/v-avaliacoes-sga-repository-interface'
import { INotasAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/notas-avaliacoes-repository-interface'
import AppError from '@/_application/_common/errors/app-error'
import { AtualizarAvaliacaoDocumentoSGAService } from '../../services/atualizar-avaliacao-documento-sga-service'
import {
  EnumStatusAvaliacao,
  PlainAvaliacao,
} from '@/_domain/avaliacoes/entities/avaliacao'
import { NotasAvaliacao } from '@/_domain/avaliacoes/entities/notas-avaliacao'

export interface Input {
  id_avaliacao: number
  atualizado_por: string
  atitude_pontos: number
  atitude_justificativa: string
  capacidade_pontos: number
  capacidade_justificativa: string
  comprometimento_pontos: number
  comprometimento_justificativa: string
  disciplina_pontos: number
  disciplina_justificativa: string
  eficiencia_pontos: number
  eficiencia_justificativa: string
  assiduidade_pontos: number
  assiduidade_justificativa: string
  etica_pontos: number
  etica_justificativa: string
  pontualidade_pontos: number
  pontualidade_justificativa: string
  proatividade_pontos: number
  proatividade_justificativa: string
  produtividade_pontos: number
  produtividade_justificativa: string
  membro1: string
  membro2: string
  membro3: string
  token: string
}

export class AtualizarAvaliacoesUsecase {
  constructor(
    private avaliacoesRepository: IAvaliacoesRepository,
    private avaliacoesSgaRepository: IVAvaliacoesSgaRepository,
    private notasRepository: INotasAvaliacoesRepository,
    private atualizarAvaliacaoDocumentoService: AtualizarAvaliacaoDocumentoSGAService,
    private pessoasPmRepository: IPessoasPmRepository,
  ) {}

  async execute(input: Input): Promise<PlainAvaliacao> {
    const avaliacaoExiste = await this.avaliacoesRepository.buscarPeloId(
      input.id_avaliacao,
    )

    if (!avaliacaoExiste) {
      throw new AppError(
        'A avaliação informada não existe na base de dados.',
        404,
      )
    }

    const avaliadoExiste = await this.pessoasPmRepository.buscarPeloIdComPessoa(
      avaliacaoExiste.avaliado.valor,
    )

    if (!avaliadoExiste) {
      throw new AppError(
        'O policial informado como avaliado não existe na base de dados.',
        404,
      )
    }

    if (avaliacaoExiste.status !== EnumStatusAvaliacao.CRIADA) {
      throw new AppError(
        'A avaliação informada possui status que não permite haver atualizações.',
        404,
      )
    }

    const notasExistentes = await this.notasRepository.buscarAtualPelaAvaliacao(
      avaliacaoExiste.id_avaliacao!,
    )

    if (!notasExistentes) {
      throw new AppError(
        'A avaliação informada não possue notas na base de dados.',
        404,
      )
    }

    const avaliacaoSga = await this.avaliacoesSgaRepository.buscarPeloId(
      input.id_avaliacao,
    )

    if (!avaliacaoSga) {
      throw new AppError(
        'A avaliação informada não possui documento correspondente no sga.',
        404,
      )
    }

    if (avaliacaoSga?.qtd_assinaturas > 0) {
      throw new AppError(
        'A avaliação informada não pode ser atualizada, pois já foi assinada.',
        404,
      )
    }

    const membro1 =
      await this.pessoasPmRepository.buscarPeloIdComPessoaEGraduacao(
        input.membro1,
      )

    if (!membro1) {
      throw new AppError(
        'O presidente da avaliação não existe na base de dados.',
        404,
      )
    }

    const membro2 =
      await this.pessoasPmRepository.buscarPeloIdComPessoaEGraduacao(
        input.membro2,
      )

    if (!membro2) {
      throw new AppError(
        'O membro 2 da avaliação não existe na base de dados.',
        404,
      )
    }

    const membro3 =
      await this.pessoasPmRepository.buscarPeloIdComPessoaEGraduacao(
        input.membro3,
      )

    if (!membro3) {
      throw new AppError(
        'O membro 3 da avaliação não existe na base de dados.',
        404,
      )
    }

    const notasMergeadas = new NotasAvaliacao({
      id_notas_avaliacao: notasExistentes.id_notas_avaliacao,
      ...input,
      fase_alteracao: notasExistentes.fase_alteracao,
      atualizado_em: new Date(),
      criado_por: notasExistentes.criado_por.valor,
      criado_em: notasExistentes.criado_em,
      atual: notasExistentes.atual,
    })

    const notas = await this.notasRepository.atualizar(notasMergeadas)

    if (avaliacaoSga?.qtd_assinaturas === 0) {
      const matriculasInteressados = [
        input.membro1,
        input.membro2,
        input.membro3,
      ]

      await this.atualizarAvaliacaoDocumentoService.execute({
        avaliacao: avaliacaoExiste,
        token: input.token,
        matriculasInteressados: matriculasInteressados.join(';'),
        membro1,
        membro2,
        membro3,
        avaliado: avaliadoExiste,
        notas,
      })
    }

    return avaliacaoExiste.toPlainObject()
  }
}
