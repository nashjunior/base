import { IPessoasPmRepository } from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'

import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'
import { ITermosCienciaRepository } from '@/_domain/avaliacoes/repositories/termos-ciencia-repository-interface'
import { IVTermosCienciaSgaRepository } from '@/_domain/avaliacoes/repositories/v-termos-ciencia-sga-repository-interface'
import AppError from '@/_application/_common/errors/app-error'
import { CriarTermoCienciaDocumentoSGAService } from '../../services/criar-termo-ciencia-documento-sga-service'
import {
  PlainTermoCiencia,
  TermoCiencia,
} from '@/_domain/avaliacoes/entities/termo-ciencia'
import { AssinarDocumentosSGAService } from '../../services/assinar-documentos-sga-service'

export interface Input {
  id_avaliacao: number
  matricula: string
  token: string
  assinatura: string
}

interface Output {
  termo: PlainTermoCiencia
  id_documento_sga: number
  path_documento_sga: string
}

export class CriarAssinarTermoCienciaUsecase {
  constructor(
    private avaliacoesRepository: IAvaliacoesRepository,
    private pessoasPmRepository: IPessoasPmRepository,
    private termosCienciaRepository: ITermosCienciaRepository,
    private vTermosCienciaSgaRepository: IVTermosCienciaSgaRepository,
    private criarTermoCienciaDocSGAService: CriarTermoCienciaDocumentoSGAService,
    private assinarDocumentosSGAService: AssinarDocumentosSGAService,
  ) {}

  async execute({
    assinatura,
    id_avaliacao,
    matricula,
    token,
  }: Input): Promise<Output> {
    const avaliadoExiste = await this.pessoasPmRepository.buscarPeloIdComPessoa(
      matricula,
    )

    if (!avaliadoExiste) {
      throw new AppError(
        'O policial informado como assinante não existe na base de dados.',
        404,
      )
    }

    const avaliacao = await this.avaliacoesRepository.buscarPeloIdCompleto(
      id_avaliacao,
    )

    if (!avaliacao?.id_avaliacao) {
      throw new AppError(
        'A avaliação informada não existe na base de dados.',
        404,
      )
    }
    const termoJaAssinado =
      await this.vTermosCienciaSgaRepository.buscarPelaAvaliacaoAssinado(
        id_avaliacao,
      )

    if (termoJaAssinado) {
      throw new AppError('Esta avaliação já possui ciência registrada.', 400)
    }

    const termoCriar = new TermoCiencia({
      id_avaliacao: avaliacao.id_avaliacao,
      criado_em: new Date(),
    })

    const termo = await this.termosCienciaRepository.criar(termoCriar)

    const documentoCriado = await this.criarTermoCienciaDocSGAService.execute({
      avaliacao,
      token,
      termo,
    })
    if (!documentoCriado) {
      throw new AppError('Documento não foi criado.', 400)
    }

    await this.assinarDocumentosSGAService.execute({
      ids_documento: [documentoCriado.id_documento_sga],
      token,
      assinante: {
        assinatura,
        matricula,
      },
    })

    return {
      termo: termo.toPlainObject(),
      id_documento_sga: documentoCriado.id_documento_sga || 0,
      path_documento_sga: documentoCriado.path_sga || '',
    }
  }
}
