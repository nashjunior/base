import { IPessoasPmRepository } from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'
import { IColegiadosRepository } from '@/_domain/colegiados/repositories/colegiados-repository-interface'

import AppError from '@/_application/_common/errors/app-error'
import { formatarObjetoDatas } from '@/_application/_common/utils/formatarObjetoDatas'
import { IMembrosComissoesAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/membros-comissoes-avaliacoes-repository-interface'
import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'
import { INotasAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/notas-avaliacoes-repository-interface'
import { IHistoricoStatusAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/historico-status-avaliacoes-repository-interface'
import { CriarAvaliacaoDocumentoSGAService } from '../../services/criar-avaliacao-documento-sga-service'
import {
  Avaliacao,
  EnumStatusAvaliacao,
  PlainAvaliacao,
} from '@/_domain/avaliacoes/entities/avaliacao'
import { HistoricoStatusAvaliacao } from '@/_domain/avaliacoes/entities/historico-status-avaliacao'
import { NotasAvaliacao } from '@/_domain/avaliacoes/entities/notas-avaliacao'
import {
  EnumTipoFuncao,
  MembroComissaoAvaliacao,
} from '@/_domain/avaliacoes/entities/membro-comissao-avaliacao'

export interface Input {
  id_colegiado: number
  numero: number
  criado_por: string
  avaliado: string
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

export class CriarAvaliacoesUsecase {
  constructor(
    private avaliacoesRepository: IAvaliacoesRepository,
    private pessoasPmRepository: IPessoasPmRepository,
    private membrosComissoesRepository: IMembrosComissoesAvaliacoesRepository,
    private colegiadosRepository: IColegiadosRepository,
    private notasAvaliacoesRepository: INotasAvaliacoesRepository,
    private criarAvaliacaoDocumentoSGAService: CriarAvaliacaoDocumentoSGAService,
    private historicoStatusAvaliacoesRepository: IHistoricoStatusAvaliacoesRepository,
  ) {}

  async execute(input: Input): Promise<PlainAvaliacao> {
    const avaliadoExiste = await this.pessoasPmRepository.buscarPeloIdComPessoa(
      input.avaliado,
    )

    if (!avaliadoExiste) {
      throw new AppError(
        'O policial informado como avaliado não existe na base de dados.',
        404,
      )
    }

    const avaliacaoJaExiste =
      await this.avaliacoesRepository.buscarPeloAvaliadoNumero(
        input.avaliado,
        input.numero,
      )

    if (avaliacaoJaExiste) {
      throw new AppError(
        `A avaliação nº ${input.numero} para este policial já existe na base de dados.`,
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

    const avaliacaoCriar = new Avaliacao({
      avaliado: input.avaliado,
      numero: input.numero,
      criado_por: input.criado_por,
      id_colegiado: input.id_colegiado,
      avaliado_opm_na_epoca: avaliadoExiste.uni_codigo,
      status: EnumStatusAvaliacao.CRIADA,
      atualizado_em: new Date(),
      atualizado_por: input.criado_por,
      criado_em: new Date(),
      deletado_em: null,
      deletado_por: null,
    })

    const avaliacao = await this.avaliacoesRepository.criar(avaliacaoCriar)

    const historicoCriar = new HistoricoStatusAvaliacao({
      status: EnumStatusAvaliacao.CRIADA,
      criado_por: input.criado_por,
      id_avaliacao: avaliacao.id_avaliacao!,
      criado_em: new Date(),
    })

    await this.historicoStatusAvaliacoesRepository.criar(historicoCriar)

    const notasCriar = new NotasAvaliacao({
      criado_por: input.criado_por,
      assiduidade_justificativa: input.assiduidade_justificativa,
      assiduidade_pontos: input.assiduidade_pontos,
      atitude_justificativa: input.atitude_justificativa,
      atitude_pontos: input.atitude_pontos,
      atualizado_por: input.criado_por,
      capacidade_justificativa: input.capacidade_justificativa,
      capacidade_pontos: input.capacidade_pontos,
      comprometimento_justificativa: input.comprometimento_justificativa,
      comprometimento_pontos: input.comprometimento_pontos,
      disciplina_justificativa: input.disciplina_justificativa,
      disciplina_pontos: input.disciplina_pontos,
      eficiencia_justificativa: input.eficiencia_justificativa,
      eficiencia_pontos: input.eficiencia_pontos,
      etica_justificativa: input.etica_justificativa,
      etica_pontos: input.etica_pontos,
      pontualidade_justificativa: input.pontualidade_justificativa,
      pontualidade_pontos: input.pontualidade_pontos,
      proatividade_justificativa: input.proatividade_justificativa,
      proatividade_pontos: input.proatividade_pontos,
      produtividade_justificativa: input.produtividade_justificativa,
      produtividade_pontos: input.produtividade_pontos,
      id_avaliacao: avaliacao.id_avaliacao!,
      atual: true,
      fase_alteracao: EnumStatusAvaliacao.CRIADA,
      atualizado_em: new Date(),
      criado_em: new Date(),
    })

    const notas = await this.notasAvaliacoesRepository.criar(notasCriar)

    const colegiado = await this.colegiadosRepository.buscarPeloIdComOpms(
      input.id_colegiado,
    )

    if (!colegiado) {
      throw new AppError(
        'O colegiado informado para esta avaliação não existe na base de dados.',
        404,
      )
    }

    const opmsColegiado = colegiado.opms_colegiado || []

    const idsOpmColegiado = opmsColegiado.map((opm) => opm.id_opm)

    const oficiaisColegiado =
      await this.pessoasPmRepository.buscarOficiaisPelasOpms(idsOpmColegiado)

    const idsMembros = [input.membro1, input.membro2, input.membro3]

    const oficiaisFiltrados = oficiaisColegiado.filter(
      (oficial) => !idsMembros.includes(oficial.pm_codigo),
    )

    const membrosNaoAvaliaram = oficiaisFiltrados.map((oficial) => {
      return new MembroComissaoAvaliacao({
        avaliou: false,
        criado_por: input.criado_por,
        membro: oficial.pm_codigo,
        id_avaliacao: avaliacao.id_avaliacao!,
        id_tipo_funcao: EnumTipoFuncao.MEMBRO,
        membro_posto_na_epoca: oficial.gra_codigo,
        criado_em: new Date(),
      })
    })

    const membro1Criar = new MembroComissaoAvaliacao({
      avaliou: true,
      criado_por: input.criado_por,
      membro: input.membro1,
      id_avaliacao: avaliacao.id_avaliacao!,
      id_tipo_funcao: EnumTipoFuncao.PRESIDENTE,
      membro_posto_na_epoca: membro1.gra_codigo,
      criado_em: new Date(),
    })

    const membro2Criar = new MembroComissaoAvaliacao({
      avaliou: true,
      criado_por: input.criado_por,
      membro: input.membro2,
      id_avaliacao: avaliacao.id_avaliacao!,
      id_tipo_funcao: EnumTipoFuncao.SECRETARIO,
      membro_posto_na_epoca: membro2.gra_codigo,
      criado_em: new Date(),
    })

    const membro3Criar = new MembroComissaoAvaliacao({
      avaliou: true,
      criado_por: input.criado_por,
      membro: input.membro3,
      id_avaliacao: avaliacao.id_avaliacao!,
      id_tipo_funcao: EnumTipoFuncao.MEMBRO,
      membro_posto_na_epoca: membro3.gra_codigo,
      criado_em: new Date(),
    })

    await this.membrosComissoesRepository.criarMembros([
      membro1Criar,
      membro2Criar,
      membro3Criar,
      ...membrosNaoAvaliaram,
    ])

    const matriculasInteressados = [input.membro1, input.membro2, input.membro3]

    await this.criarAvaliacaoDocumentoSGAService.execute({
      avaliacao,
      token: input.token,
      matriculasInteressados: matriculasInteressados.join(';'),
      membro1,
      membro2,
      membro3,
      avaliado: avaliadoExiste,
      notas,
    })

    const avaliacaoCompleta =
      await this.avaliacoesRepository.buscarPeloIdCompleto(
        avaliacao.id_avaliacao!,
      )

    if (!avaliacaoCompleta) {
      throw new AppError(
        'A avaliação informada não existe na base de dados.',
        404,
      )
    }

    if (avaliacaoCompleta.recurso) {
      return {
        ...avaliacaoCompleta.toPlainObject(),
        recurso: formatarObjetoDatas(avaliacaoCompleta.recurso),
      }
    }

    return avaliacaoCompleta.toPlainObject()
  }
}
