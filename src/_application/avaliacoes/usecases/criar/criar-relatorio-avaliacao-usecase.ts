import AppError from '@/_application/_common/errors/app-error'
import { IAvaliacoesRepository } from '@/_domain/avaliacoes/repositories/avaliacoes-repository-interface'

import { env } from '@/env'
import axios from 'axios'
import { PDFDocument } from 'pdf-lib'

export class CriarRelatorioAvaliacaoUsecase {
  constructor(private avaliacoesRepository: IAvaliacoesRepository) {}

  async execute(id_avaliacao: number): Promise<any> {
    async function downloadPdf(url: string): Promise<Buffer> {
      const response = await axios.get(url, { responseType: 'arraybuffer' })

      return Buffer.from(response.data)
    }
    const avaliacao = await this.avaliacoesRepository.buscarPeloIdCompleto(
      id_avaliacao,
    )

    if (!avaliacao) {
      throw new AppError(
        'A avaliação informada não existe na base de dados.',
        404,
      )
    }

    const avaliacaoPdfBytes = await downloadPdf(
      `${env.URL_API_SGA}/public/documentos/pdf${avaliacao.avaliacao_sga?.path_sga}`,
    )

    const avaliacaoPdf = await PDFDocument.load(avaliacaoPdfBytes)

    const mergedPdf = await PDFDocument.create()

    const avaliacaoPages = await mergedPdf.copyPages(
      avaliacaoPdf,
      avaliacaoPdf.getPageIndices(),
    )
    avaliacaoPages.forEach((page) => mergedPdf.addPage(page))

    if (avaliacao.termo_sga?.assinado) {
      const termoCienciaBuffer = await downloadPdf(
        `${env.URL_API_SGA}/public/documentos/pdf${avaliacao.termo_sga.path_sga}`,
      )
      const termoCienciaPdf = await PDFDocument.load(termoCienciaBuffer)
      const termoCienciaPages = await mergedPdf.copyPages(
        termoCienciaPdf,
        termoCienciaPdf.getPageIndices(),
      )
      termoCienciaPages.forEach((page) => mergedPdf.addPage(page))
    }

    const termoRespostaComissao = avaliacao.recurso?.termos_sga?.find(
      (termo) => termo.instancia === 'comissao',
    )

    if (termoRespostaComissao && termoRespostaComissao.qtd_assinaturas > 2) {
      const termoRespostaComissaoBuffer = await downloadPdf(
        `${env.URL_API_SGA}/public/documentos/pdf${termoRespostaComissao.path_sga}`,
      )
      const termoRespostaComissaoPdf = await PDFDocument.load(
        termoRespostaComissaoBuffer,
      )
      const termoRespostaComissaoPages = await mergedPdf.copyPages(
        termoRespostaComissaoPdf,
        termoRespostaComissaoPdf.getPageIndices(),
      )
      termoRespostaComissaoPages.forEach((page) => mergedPdf.addPage(page))
    }

    const termoRespostaCGP = avaliacao.recurso?.termos_sga?.find(
      (termo) => termo.instancia === 'cgp',
    )

    if (termoRespostaCGP && termoRespostaCGP.qtd_assinaturas > 2) {
      const termoRespostaCGPBuffer = await downloadPdf(
        `${env.URL_API_SGA}/public/documentos/pdf${termoRespostaCGP.path_sga}`,
      )
      const termoRespostaCGPPdf = await PDFDocument.load(termoRespostaCGPBuffer)
      const termoRespostaCGPPages = await mergedPdf.copyPages(
        termoRespostaCGPPdf,
        termoRespostaCGPPdf.getPageIndices(),
      )
      termoRespostaCGPPages.forEach((page) => {
        mergedPdf.addPage(page)
      })
    }
    return mergedPdf.save()
  }
}
