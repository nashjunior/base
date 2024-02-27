import { AppDataSource } from '..'
import { AssinarDocumentosAvaliacoesUsecase } from '@/_application/avaliacoes/usecases/atualizar/assinar-documentos-avaliacoes-usecase'
import { AssinarDocumentosSGAService } from '@/_application/avaliacoes/services/assinar-documentos-sga-service'
import { EnviarEmailsService } from '@/_application/avaliacoes/services/enviar-emails-service'
import { AvaliacoesRepository } from '../repositories/avaliacoes/avaliacoes-repository'
import { VDocumentosSgaRepository } from '../repositories/avaliacoes/v-documentos-sga-repository'

type Assinante = {
  matricula: string
  assinatura: string
}

export interface Input {
  ids_documentos_sga: number[]
  assinante: Assinante
  token: string
}
export async function assinarDocumentosTransaction({
  assinante,
  ids_documentos_sga,
  token,
}: Input) {
  return AppDataSource.transaction(async (entityManager) => {
    const vdocumentosSgaRepository = new VDocumentosSgaRepository(entityManager)
    const avaliacoesRepository = new AvaliacoesRepository(entityManager)

    const assinarDocumentosSGAService = new AssinarDocumentosSGAService()
    const enviarEmailsService = new EnviarEmailsService()

    const assinarUsecase = new AssinarDocumentosAvaliacoesUsecase(
      avaliacoesRepository,
      vdocumentosSgaRepository,
      assinarDocumentosSGAService,
      enviarEmailsService,
    )

    await assinarUsecase.execute({
      assinante,
      ids_documentos_sga,
      token,
    })
  })
}
