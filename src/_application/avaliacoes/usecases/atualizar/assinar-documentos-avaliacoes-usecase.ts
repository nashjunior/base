import AppError from '@/_application/_common/errors/app-error'
import { AssinarDocumentosSGAService } from '../../services/assinar-documentos-sga-service'
import { EnviarEmailsService } from '../../services/enviar-emails-service'
import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'
import { IVDocumentosSgaRepository } from '@/_domain/avaliacoes/repositories/v-documentos-sga-repository-interface'

type Assinante = {
  matricula: string
  assinatura: string
}

export interface Input {
  ids_documentos_sga: number[]
  assinante: Assinante
  token: string
}

export class AssinarDocumentosAvaliacoesUsecase {
  constructor(
    private avaliacoesRepository: IAvaliacoesRepository,
    private vdocumentosSgaRepository: IVDocumentosSgaRepository,
    private assinarDocumentosSGAService: AssinarDocumentosSGAService,
    private enviarEmailsService: EnviarEmailsService,
  ) {}

  async execute({
    assinante,
    ids_documentos_sga,
    token,
  }: Input): Promise<void> {
    const documentos = await this.vdocumentosSgaRepository.buscarPeloIdsSga(
      ids_documentos_sga,
    )

    const documentosAvaliacoes = documentos.filter(
      (doc) => doc.tipo === 'avaliacao',
    )

    const idsAvaliacoes = documentosAvaliacoes.map((doc) => doc.id_documento)

    await this.avaliacoesRepository.buscarPelosIdsLock(idsAvaliacoes)

    const matriculasAvaliacoesAssinadas = documentosAvaliacoes
      .filter((doc) => Number(doc.qtd_assinaturas) === 2)
      .map((docAva) => docAva.pes_codigo)

    if (documentos.length === 0) {
      throw new AppError('Nenhum documentos foi encontrado.', 404)
    }

    await this.assinarDocumentosSGAService.execute({
      ids_documento: documentos.map((doc) => doc.id_documento_sga),
      token,
      assinante,
    })

    if (matriculasAvaliacoesAssinadas.length > 0) {
      await this.enviarEmailsService.execute({
        assunto: 'Avaliação Estágio Probatório',
        html: `<p>Senhor(a) Policial,</p>
          <p>Uma avaliação do seu Estágio Probatório foi realizada.
          <p>Acesse o Sistema Eletrônico de Gestão de Estágio Probatório - SEGEP.</p>
          <p><a href="https://segep.pm.ce.gov.br">https://segep.pm.ce.gov.br</a></p>
          <p>Célula de Tecnologia da Informação e Comunicação da PMCE</p>`,
        matriculas: matriculasAvaliacoesAssinadas,
      })
    }
  }
}
