import PDFPrinter from 'pdfmake'
import path from 'path'
import os from 'os'
import fs from 'fs'
import FormData from 'form-data'
import { PDFDocument } from 'pdf-lib'
// eslint-disable-next-line
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import axios from 'axios'
import { env } from '@/env'

import { IPessoa } from '@/_domain/pessoas/repositories/pessoas-repository-interface'
import { IPessoaPm } from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'

import { headerPDF } from '@/_application/_common/_imagens/headerPDF'

import { footerPDF } from '@/_application/_common/_imagens/footerPDF'
import { formatarDateTime } from '@/_application/_common/utils/formatarDateTime'
import AppError from '@/_application/_common/errors/app-error'
import { Avaliacao } from '@/_domain/avaliacoes/entities/avaliacao'
import { NotasAvaliacao } from '@/_domain/avaliacoes/entities/notas-avaliacao'
import { TermoRespostaRecurso } from '@/_domain/avaliacoes/entities/termo-resposta-recurso'
import { Recurso } from '@/_domain/avaliacoes/entities/recurso'

interface Input {
  avaliacao: Avaliacao
  notas: NotasAvaliacao
  termo: TermoRespostaRecurso
  membro1: IPessoaPm
  membro2: IPessoaPm
  membro3: IPessoaPm
  recurso: Recurso
  avaliado: IPessoa
  token: string
  pathAnexoCGP: string | null
}

interface Output {
  id_documento_sga: number
  path_sga: string
}

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
}

export class CriarRespostaCGPDocumentoSGAService {
  public async execute({
    avaliacao,
    membro1,
    membro2,
    membro3,
    notas,
    termo,
    recurso,
    avaliado,
    token,
    pathAnexoCGP,
  }: Input): Promise<Output | undefined> {
    const matriculasInteressados = [
      membro1.pm_codigo,
      membro2.pm_codigo,
      membro3.pm_codigo,
    ]

    try {
      const printer = new PDFPrinter(fonts)
      const media =
        (notas.assiduidade_pontos +
          notas.atitude_pontos +
          notas.capacidade_pontos +
          notas.comprometimento_pontos +
          notas.disciplina_pontos +
          notas.eficiencia_pontos +
          notas.etica_pontos +
          notas.pontualidade_pontos +
          notas.produtividade_pontos +
          notas.proatividade_pontos) /
        10

      const docDefinitions: TDocumentDefinitions = {
        pageSize: 'A4',
        pageMargins: [30, 100, 30, 62],
        defaultStyle: { font: 'Helvetica', fontSize: 9, lineHeight: 1.3 },
        header: [
          {
            image: headerPDF,
            width: 240,
            alignment: 'center',
            margin: [0, 30],
          },
        ],
        footer(currentPage, pageCount) {
          return [
            {
              columns: [
                {
                  text: `SEGEP`,
                  margin: [30, 0, 0, 0],
                },
                {
                  text: `${currentPage.toString()} de ${pageCount}`,
                  alignment: 'right',
                  margin: [0, 0, 30, 0],
                },
              ],
            },
            { image: footerPDF, height: 50, width: 600 },
          ]
        },

        content: [
          {
            text: `RESPOSTA DA COORDENADORIA DE GESTAO DE PESSOAS ACERCA DO RECURSO DE AVALIAÇÃO PERIÓDICA DE APTIDÃO TÉCNICA E PROFISSIONAL`,
            bold: true,
            alignment: 'center',
            margin: [0, 20, 0, 0],
          },
          {
            text: `1 - DADOS GERAIS:`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `Avaliado: SD PM ${avaliado.pes_nome}, MF: ${avaliado.pes_codigo}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Data da avaliação: ${avaliacao.criado_em.toLocaleString(
              'pt-BR',
              { dateStyle: 'short', timeStyle: 'short' },
            )}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nº da avaliação: ${avaliacao.numero} de 3`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Comissão de avaliação da CGP:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Membro 1: ${membro1.graduacao?.gra_sigla} ${membro1.pessoa?.pes_nome}, MF: ${membro1.pm_codigo}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Membro 2: ${membro2.graduacao?.gra_sigla} ${membro2.pessoa?.pes_nome}, MF: ${membro2.pm_codigo}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Membro 3: ${membro3.graduacao?.gra_sigla} ${membro3.pessoa?.pes_nome}, MF: ${membro3.pm_codigo}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `2 - NOTA DA AVALIAÇÃO: ${media.toFixed(2)}`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `3 - CIENCIA DO AVALIADO: ${formatarDateTime(
              avaliacao.termo_ciencia?.criado_em,
            )}`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `4 - RECURSO DO AVALIADO:`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `a) Data do recurso: ${formatarDateTime(recurso.criado_em)}`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `b) Descrição do recurso:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `${recurso.descricao.valor}`,
            alignment: 'justify',
          },
          {
            text: `c) Documento anexado:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          recurso.path_documento
            ? {
                text: `ANEXADO - VISUALIZAR PELO SISTEMA`,
              }
            : {
                text: `NÃO ANEXADO`,
              },

          {
            text: `5 - RESPOSTA DA COMISSÃO:`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `a) Data da resposta: ${formatarDateTime(
              recurso.respondido_comissao_em,
            )}`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `b) Tipo de resposta: ${
              recurso.deferido_comissao ? 'DEFERIDO' : 'INDEFERIDO'
            }`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `c) Resposta:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `${recurso.resposta_comissao?.valor}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `d) Documento anexado:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          recurso.path_documento_comissao
            ? {
                text: `ANEXADO - VISUALIZAR PELO SISTEMA`,
              }
            : {
                text: `NÃO ANEXADO`,
              },
          {
            text: `6 - RESPOSTA DA CGP:`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `a) Data da resposta: ${formatarDateTime(
              recurso.respondido_cgp_em,
            )}`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `b) Tipo de resposta: ${
              recurso.deferido_cgp ? 'DEFERIDO' : 'INDEFERIDO'
            }`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `c) Resposta:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `${recurso.resposta_cgp?.valor}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `d) Documento anexado:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          recurso.path_documento_cgp
            ? {
                text: `ANEXADO - VISUALIZAR PELO SISTEMA`,
              }
            : {
                text: `NÃO ANEXADO`,
              },
        ], // fim content
        styles: {
          header: {
            margin: [0, 0, 0, 0],
          },
        },
      }

      const pdfDoc = printer.createPdfKitDocument(docDefinitions)

      const tempFilePath = path.join(
        os.tmpdir(),
        `${Date.now()}-${avaliacao.avaliado}-resposta-cgp.pdf`,
      )
      const writeStream = fs.createWriteStream(tempFilePath)
      pdfDoc.pipe(writeStream)
      pdfDoc.end()

      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => resolve())
        writeStream.on('error', (err) => reject(err))
      })

      const mergedPdf = await PDFDocument.create()

      const respostaCGPDoc = await PDFDocument.load(
        fs.readFileSync(tempFilePath),
      )

      const respostaCGPPages = await mergedPdf.copyPages(
        respostaCGPDoc,
        respostaCGPDoc.getPageIndices(),
      )

      respostaCGPPages.forEach((page) => mergedPdf.addPage(page))

      const mergedPdfBytes = await mergedPdf.save()
      fs.writeFileSync(tempFilePath, mergedPdfBytes)

      if (pathAnexoCGP) {
        const anexoCGP = fs.readFileSync(pathAnexoCGP)

        const anexoCGPPdfDoc = await PDFDocument.load(anexoCGP)
        const anexoRecursoPdfPages = await mergedPdf.copyPages(
          anexoCGPPdfDoc,
          anexoCGPPdfDoc.getPageIndices(),
        )
        anexoRecursoPdfPages.forEach((page) => mergedPdf.addPage(page))

        const mergedPdfBytes = await mergedPdf.save()
        fs.writeFileSync(tempFilePath, mergedPdfBytes)
      }

      const formData = new FormData()
      formData.append('files', fs.createReadStream(tempFilePath))
      formData.append('id_sistema', env.ID_SISTEMA)
      formData.append('id_tipo_documento', 3)
      formData.append('id_documento_origem', termo.id_termo_resposta_recurso)
      formData.append('tipo_documento', 'Resposta da CGP a recurso')
      formData.append('numero_documento', termo.id_termo_resposta_recurso)
      formData.append(
        'matriculas_interessados',
        matriculasInteressados.join(';'),
      )

      const resposta = await axios.post(
        `${env.URL_API_SGA}/documentos`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return {
        id_documento_sga: resposta.data.id_documento,
        path_sga: resposta.data.path,
      }
    } catch (error) {
      console.error(error)

      throw new AppError('Ocorreu um erro ao tentar salvar o documento no SGA')
    }
  }
}
