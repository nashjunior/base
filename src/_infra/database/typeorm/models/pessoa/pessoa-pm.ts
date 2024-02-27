import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm'
import { Graduacao } from './graduacao'
import { Pessoa } from './pessoa'
import { Unidade } from './unidade'
import { VPolicialAvaliacaoSituacaoTypeOrm } from '../segep/v-policial-avaliacao-situacao'
import { IPessoaPm } from '@/_domain/pessoas/repositories/pessoas-pm-repository-interface'

@Entity('pessoa_pm', { schema: 'public', synchronize: false })
export class PessoaPm implements IPessoaPm {
  @PrimaryColumn('varchar')
  pm_codigo: string

  @Column('varchar')
  pm_cpf: string

  @Column('varchar')
  pm_apelido: string

  @Column('varchar')
  pm_numero: string

  @Column('int')
  gra_codigo: number

  @Column('int')
  uni_codigo: number

  @Column('int')
  pts_codigo: number

  @Column('int')
  pms_codigo: number

  @Column('timestamp without time zone')
  data_alteracao: Date

  @Column('date')
  pm_data_entrada: Date

  @Column('varchar')
  usuario_alteracao: string

  @Column('bytea')
  pm_foto: Buffer

  @OneToOne(() => Pessoa)
  @JoinColumn({ name: 'pm_codigo' })
  pessoa?: Pessoa

  @OneToOne(() => Graduacao)
  @JoinColumn({ name: 'gra_codigo' })
  graduacao?: Graduacao

  @OneToOne(() => Unidade)
  @JoinColumn({ name: 'uni_codigo' })
  opm?: Unidade

  @OneToOne(() => VPolicialAvaliacaoSituacaoTypeOrm)
  @JoinColumn({ name: 'pm_codigo', referencedColumnName: 'pes_codigo' })
  policial_avaliacao_situacao?: VPolicialAvaliacaoSituacaoTypeOrm
}
