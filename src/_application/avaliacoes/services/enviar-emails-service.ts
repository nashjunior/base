import AppError from '@/_application/_common/errors/app-error'
import { apiMail } from '@/_application/_common/services/api-mail'

export interface Input {
  matriculas: string[]
  assunto: string
  html: string
}

export class EnviarEmailsService {
  public async execute({ matriculas, assunto, html }: Input): Promise<void> {
    try {
      apiMail.post('send/lote', {
        assunto,
        html,
        matriculas,
      })
    } catch (error: any) {
      console.error(error)
      throw new AppError('Ocorreu um erro ao tentar enviar o email')
    }
  }
}
