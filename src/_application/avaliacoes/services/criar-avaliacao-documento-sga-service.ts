import PDFPrinter from 'pdfmake'
import path from 'path'
import os from 'os'
import fs from 'fs'
import FormData from 'form-data'
// eslint-disable-next-line
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';

import { headerPDF } from '@/_application/_common/_imagens/headerPDF'
import { footerPDF } from '@/_application/_common/_imagens/footerPDF'
import axios from 'axios'
import { env } from '@/env'
import { IPessoaPm } from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'

import AppError from '@/_application/_common/errors/app-error'
import { Avaliacao } from '@/_domain/avaliacoes/entities/avaliacao'
import { NotasAvaliacao } from '@/_domain/avaliacoes/entities/notas-avaliacao'

interface Input {
  avaliacao: Avaliacao
  avaliado: IPessoaPm
  membro1: IPessoaPm
  membro2: IPessoaPm
  membro3: IPessoaPm
  token: string
  matriculasInteressados: string
  notas: NotasAvaliacao
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

export class CriarAvaliacaoDocumentoSGAService {
  constructor() {}

  public async execute({
    avaliacao,
    token,
    matriculasInteressados,
    membro1,
    membro2,
    membro3,
    avaliado,
    notas,
  }: Input): Promise<Output | undefined> {
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
            text: `RELATÓRIO DE AVALIAÇÃO PERIÓDICA DE APTIDÃO TÉCNICA E PROFISSIONAL`,
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
            text: `Avaliado: SD PM ${avaliado.pessoa?.pes_nome}, MF: ${avaliado.pm_codigo}`,
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
            text: `2 - DADOS DA AVALIAÇÃO:`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `Critério 1 - Assiduidade:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.assiduidade_pontos}`,
          },
          {
            text: `Justificativa: ${notas.assiduidade_justificativa.valor}`,
          },
          {
            text: `Critério 2 - Atitude Militar:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.atitude_pontos}`,
          },
          {
            text: `Justificativa: ${notas.atitude_justificativa.valor}`,
          },
          {
            text: `Critério 3 - Capacidade Técnica Profissional:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.capacidade_pontos}`,
          },
          {
            text: `Justificativa: ${notas.capacidade_justificativa.valor}`,
          },
          {
            text: `Critério 4 - Comprometimento com as diretrizes de comando:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.comprometimento_pontos}`,
          },
          {
            text: `Justificativa: ${notas.comprometimento_justificativa.valor}`,
          },
          {
            text: `Critério 5 - Disciplina:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.disciplina_pontos}`,
          },
          {
            text: `Justificativa: ${notas.disciplina_justificativa.valor}`,
          },
          {
            text: `Critério 6 - Eficiência:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.eficiencia_pontos}`,
          },
          {
            text: `Justificativa: ${notas.eficiencia_justificativa.valor}`,
          },
          {
            text: `Critério 7 - Ética cívico-militar:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.etica_pontos}`,
          },
          {
            text: `Justificativa: ${notas.etica_justificativa.valor}`,
          },
          {
            text: `Critério 8 - Pontualidade:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.pontualidade_pontos}`,
          },
          {
            text: `Justificativa: ${notas.pontualidade_justificativa.valor}`,
          },
          {
            text: `Critério 9 - Proatividade:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.proatividade_pontos}`,
          },
          {
            text: `Justificativa: ${notas.proatividade_justificativa.valor}`,
          },
          {
            text: `Critério 10 - Produtividade:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Nota: ${notas.produtividade_pontos}`,
          },
          {
            text: `Justificativa: ${notas.produtividade_justificativa.valor}`,
          },
          {
            text: `3 - Nota final da avaliação: ${media.toFixed(2)}`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `O presente relatório segue assinado eletronicamente pelos avaliadores e avaliado e os dados foram extraídos do Sistema de Avaliação do Estágio Probatório da PMCE, SEGEP, conforme Decreto nº 35.102 de 30 de novembro de 2022 e Portaria nº 015/2024 - GC, publicada no BCG nº 025 de 05/02/2024.`,
            alignment: 'justify',
            margin: [0, 20, 0, 0],
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
        `${Date.now()}-${avaliacao.avaliado}-avaliacao.pdf`,
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
      formData.append('id_tipo_documento', 1)
      formData.append('id_documento_origem', avaliacao.id_avaliacao)
      formData.append('tipo_documento', 'Avaliação')
      formData.append('numero_documento', avaliacao.id_avaliacao)
      formData.append('matriculas_interessados', matriculasInteressados)

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
