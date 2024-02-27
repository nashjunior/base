import PDFPrinter from 'pdfmake'
import path from 'path'
import os from 'os'
import fs from 'fs'
import FormData from 'form-data'
// eslint-disable-next-line
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import axios from 'axios'
import { env } from '@/env'
import { headerPDF } from '@/_application/_common/_imagens/headerPDF'
import { footerPDF } from '@/_application/_common/_imagens/footerPDF'
import AppError from '@/_application/_common/errors/app-error'
import { Avaliacao } from '@/_domain/avaliacoes/entities/avaliacao'
import { TermoCiencia } from '@/_domain/avaliacoes/entities/termo-ciencia'
import { NotasAvaliacao } from '@/_domain/avaliacoes/entities/notas-avaliacao'
import { EnumTipoFuncao } from '@/_domain/avaliacoes/entities/membro-comissao-avaliacao'

interface Input {
  avaliacao: Avaliacao
  token: string
  termo: TermoCiencia
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

export class CriarTermoCienciaDocumentoSGAService {
  public async execute({
    avaliacao,
    termo,
    token,
  }: Input): Promise<Output | undefined> {
    try {
      const printer = new PDFPrinter(fonts)
      const notas = avaliacao.notas
        ? avaliacao.notas[0]
        : ({} as NotasAvaliacao)

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

      const membros = avaliacao.membros || []

      const membro1 = membros.find(
        (membro) => membro.id_tipo_funcao === EnumTipoFuncao.PRESIDENTE,
      )

      const membro2 = membros.find(
        (membro) => membro.id_tipo_funcao === EnumTipoFuncao.SECRETARIO,
      )

      const membro3 = membros.find(
        (membro) => membro.id_tipo_funcao === EnumTipoFuncao.MEMBRO,
      )

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
            text: `TERMO DE CIÊNCIA DE AVALIAÇÃO PERIÓDICA DE APTIDÃO TÉCNICA E PROFISSIONAL`,
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
            text: `Avaliado: SD PM ${avaliacao.avaliado.valor}, MF: ${avaliacao.avaliado.valor}`,
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
            text: `Comissão de avaliação:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Membro 1: ${membro1?.membro_posto?.gra_sigla} ${membro1?.pessoa_membro?.pes_nome}, MF: ${membro1?.membro.valor}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Membro 2: ${membro2?.membro_posto?.gra_sigla} ${membro2?.pessoa_membro?.pes_nome}, MF: ${membro2?.membro.valor}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Membro 3: ${membro3?.membro_posto?.gra_sigla} ${membro3?.pessoa_membro?.pes_nome}, MF: ${membro3?.membro.valor}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `2 - NOTA DA AVALIAÇÃO: ${media}`,
            bold: true,
            margin: [0, 20, 0, 0],
          },

          {
            text: `3 - CIÊNCIA DO AVALIADO:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `EU, SD PM ${
              avaliacao.policial_avaliacao_situacao?.pes_nome
            }, MF: ${
              avaliacao.avaliado.valor
            }, declaro que tomei ciência nesta data, ${new Date().toLocaleString(
              'pt-BR',
              { dateStyle: 'short', timeStyle: 'short' },
            )}, da nota da ${
              avaliacao.numero
            }ª avaliação periódica de aptidão técnica e profissional do cargo de Soldado da PMCE e que conforme o Art. 8, caput, do Decreto nº 35.102, tenho 5 (cinco) dias úteis a contar desta data para impetrar recurso caso não concorde com o resultado. Conforme portaria nº 015/2024 - GC, o referido recurso deverá ser feio de forma eletrônica no sistema SEGEP. `,
            alignment: 'justify',
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
        `${Date.now()}-${avaliacao.avaliado.valor}-ciencia.pdf`,
      )
      const writeStream = fs.createWriteStream(tempFilePath)
      pdfDoc.pipe(writeStream)
      pdfDoc.end()

      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => resolve())
        writeStream.on('error', (err) => reject(err))
      })

      const formData = new FormData()
      formData.append('files', fs.createReadStream(tempFilePath))
      formData.append('id_sistema', env.ID_SISTEMA)
      formData.append('id_tipo_documento', 2)
      formData.append('id_documento_origem', termo.id_termo_ciencia)
      formData.append('tipo_documento', 'Termo de Ciência')
      formData.append('numero_documento', termo.id_termo_ciencia)
      formData.append('matriculas_interessados', avaliacao.avaliado.valor)

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
      console.log(error)
      throw new AppError('Ocorreu um erro ao tentar salvar o documento no SGA')
    }
  }
}
