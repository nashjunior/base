import { EntityManager, In, LessThanOrEqual, Repository } from 'typeorm'
import { AppDataSource } from '../..'
import { PessoaPm } from '../../models/pessoa/pessoa-pm'
import {
  IPessoaPm,
  IPessoasPmRepository,
  OutputBuscarPoliciaisPelaPesquisa,
} from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'

export class PessoasPmRepository implements IPessoasPmRepository {
  private ormRepository: Repository<PessoaPm>

  constructor(private transaction?: EntityManager) {
    this.ormRepository = transaction
      ? transaction.getRepository(PessoaPm)
      : AppDataSource.getRepository(PessoaPm)
  }

  public async buscarOficiaisPelaPesquisa(
    pesquisa: string,
  ): Promise<OutputBuscarPoliciaisPelaPesquisa[]> {
    const query = `
      SELECT
        pe.pes_codigo,
        grd.gra_sigla,
        pe.pes_nome
      FROM
        pessoa as pe
          INNER JOIN pessoa_pm as ppm
          ON pe.pes_codigo = ppm.pm_codigo
          AND ppm.pts_codigo in (1, 5, 7)
          INNER JOIN graduacao as grd
          ON ppm.gra_codigo = grd.gra_codigo
          AND grd.gra_oficial = 'S'
      ORDER BY
        grd.gra_prioridade ASC;
    `
    const queryWithSearch = `
      SELECT
        pe.pes_codigo,
        grd.gra_sigla,
        pe.pes_nome
      FROM
        pessoa as pe
          INNER JOIN pessoa_pm as ppm
          ON pe.pes_codigo = ppm.pm_codigo
          AND ppm.pts_codigo in (1, 5, 7)
          INNER JOIN graduacao as grd
          ON ppm.gra_codigo = grd.gra_codigo
          AND grd.gra_oficial = 'S'
      WHERE
        pe.pes_codigo ILIKE '%${pesquisa}%'
        OR pe.pes_nome ILIKE '%${pesquisa}%'
        OR pe.pes_codigo ILIKE '%${pesquisa}%'
      ORDER BY
        grd.gra_prioridade ASC;
    `

    const result = await this.ormRepository.query(
      pesquisa ? queryWithSearch : query,
    )

    return result
  }

  public async buscarPoliciaisPelaPesquisa(
    pesquisa: string,
  ): Promise<OutputBuscarPoliciaisPelaPesquisa[]> {
    const query = `
      SELECT
        pe.pes_codigo,
        grd.gra_sigla,
        pe.pes_nome
      FROM
        pessoa as pe
          INNER JOIN pessoa_pm as ppm
          ON pe.pes_codigo = ppm.pm_codigo
          AND ppm.pts_codigo in (1, 5, 7)
          INNER JOIN graduacao as grd
          ON ppm.gra_codigo = grd.gra_codigo
      ORDER BY
        grd.gra_prioridade ASC;
    `
    const queryWithSearch = `
      SELECT
        pe.pes_codigo,
        grd.gra_sigla,
        pe.pes_nome
      FROM
        pessoa as pe
          INNER JOIN pessoa_pm as ppm
          ON pe.pes_codigo = ppm.pm_codigo
          AND ppm.pts_codigo in (1, 5, 7)
          INNER JOIN graduacao as grd
          ON ppm.gra_codigo = grd.gra_codigo
      WHERE
        pe.pes_codigo ILIKE '%${pesquisa}%'
        OR pe.pes_nome ILIKE '%${pesquisa}%'
        OR pe.pes_codigo ILIKE '%${pesquisa}%'
      ORDER BY
        grd.gra_prioridade ASC;
    `

    const result = await this.ormRepository.query(
      pesquisa ? queryWithSearch : query,
    )

    return result
  }

  public async buscarSoldadosPelaPesquisa(
    pesquisa: string,
  ): Promise<OutputBuscarPoliciaisPelaPesquisa[]> {
    const query = `
      SELECT
        pe.pes_codigo,
        grd.gra_sigla,
        pe.pes_nome
      FROM
        pessoa as pe
          INNER JOIN pessoa_pm as ppm
          ON pe.pes_codigo = ppm.pm_codigo
          AND ppm.pts_codigo in (1, 5, 7)
          INNER JOIN graduacao as grd
          ON ppm.gra_codigo = grd.gra_codigo
          AND grd.gra_sigla = 'SD'
      ORDER BY
        grd.gra_prioridade ASC;
    `
    const queryWithSearch = `
      SELECT
        pe.pes_codigo,
        grd.gra_sigla,
        pe.pes_nome
      FROM
        pessoa as pe
          INNER JOIN pessoa_pm as ppm
          ON pe.pes_codigo = ppm.pm_codigo
          AND ppm.pts_codigo in (1, 5, 7)
          INNER JOIN graduacao as grd
          ON ppm.gra_codigo = grd.gra_codigo
          AND grd.gra_sigla = 'SD'
      WHERE
        pe.pes_codigo ILIKE '%${pesquisa}%'
        OR pe.pes_nome ILIKE '%${pesquisa}%'
        OR pe.pes_codigo ILIKE '%${pesquisa}%'
      ORDER BY
        grd.gra_prioridade ASC;
    `

    const result = await this.ormRepository.query(
      pesquisa ? queryWithSearch : query,
    )

    return result
  }

  public async buscarOficiaisPelasOpms(opms: number[]): Promise<IPessoaPm[]> {
    const oficiais = await this.ormRepository.find({
      select: [
        'pm_codigo',
        'pm_cpf',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'data_alteracao',
        'pts_codigo',
        'pms_codigo',
      ],
      where: {
        uni_codigo: In(opms),
        pts_codigo: In([1, 5, 7]),
        gra_codigo: LessThanOrEqual(6),
      },
    })

    return oficiais
  }

  public async buscarPeloId(pes_codigo: string): Promise<IPessoaPm | null> {
    const pessoa = await this.ormRepository.findOne({
      select: [
        'pm_codigo',
        'pm_cpf',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'data_alteracao',
        'pts_codigo',
        'pms_codigo',
      ],
      where: { pm_codigo: pes_codigo },
    })

    return pessoa
  }

  public async buscarImagemPeloId(
    pes_codigo: string,
  ): Promise<IPessoaPm | null> {
    const pessoa = await this.ormRepository.findOne({
      select: ['pm_foto'],
      where: { pm_codigo: pes_codigo },
    })

    return pessoa
  }

  public async buscarPeloIdComPessoa(id: string): Promise<IPessoaPm | null> {
    const pessoa = await this.ormRepository.findOne({
      select: [
        'pm_codigo',
        'pm_cpf',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'data_alteracao',
        'pts_codigo',
        'pms_codigo',
      ],
      relations: ['pessoa'],
      where: { pm_codigo: id },
    })

    return pessoa
  }

  public async buscarPeloIdComPessoaEGraduacao(
    id: string,
  ): Promise<IPessoaPm | null> {
    const pessoa = await this.ormRepository.findOne({
      select: [
        'pm_codigo',
        'pm_cpf',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'data_alteracao',
        'pts_codigo',
        'pms_codigo',
      ],
      relations: ['pessoa', 'graduacao'],
      where: { pm_codigo: id },
    })

    return pessoa
  }

  public async buscarPeloIdComAvalicaoSituacao(
    id: string,
  ): Promise<IPessoaPm | null> {
    const pessoa = await this.ormRepository.findOne({
      select: [
        'pm_codigo',
        'pm_cpf',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'pts_codigo',
        'pms_codigo',
        'pm_data_entrada',
      ],
      relations: ['pessoa', 'opm', 'policial_avaliacao_situacao'],
      where: { pm_codigo: id },
    })

    return pessoa
  }
}
