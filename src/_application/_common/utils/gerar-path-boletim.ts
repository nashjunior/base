import { IBoletim } from '@/_domain/boletins/repositories/boletins-repository-interface'

import { format, parseISO } from 'date-fns'

export function gerarPathBoletim(boletim: IBoletim): string {
  let pathSisbol = ''
  if (boletim.unidade) {
    const nomeArquivo = `${String(
      boletim.unidade.uni_boletim_caminho,
    ).toUpperCase()}${String(boletim.bol_numero).padStart(3, '0')}-${format(
      parseISO(boletim.bol_data),
      'dd.MM.yy',
    )}.pdf`
    pathSisbol = `${boletim?.unidade.uni_boletim_caminho}/${boletim?.bol_ano}/${nomeArquivo}`
  }

  return pathSisbol
}
