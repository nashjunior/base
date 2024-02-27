import axios from 'axios'
import { env } from '@/env'

import AppError from '@/_application/_common/errors/app-error'

type Assinante = {
  matricula: string
  assinatura: string
}

export interface Input {
  ids_documento: number[]
  assinante: Assinante
  token: string
}

export class AssinarDocumentosSGAService {
  public async execute({
    ids_documento,
    token,
    assinante,
  }: Input): Promise<void> {
    try {
      await axios.post(
        `${env.URL_API_SGA}/documentos/assinar`,
        {
          ids_documento,
          pes_codigo: assinante.matricula,
          assinatura: assinante.assinatura,
          tipo_assinatura: '0',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
    } catch (error: any) {
      if (error?.response.data?.message === 'Assinatura está incorreta.') {
        throw new AppError('Assinatura está incorreta.')
      } else {
        console.error(error)
        throw new AppError(
          'Ocorreu um erro ao tentar assinar o documento no SGA',
        )
      }
    }
  }
}
