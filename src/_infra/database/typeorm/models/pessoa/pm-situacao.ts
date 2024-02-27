import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { SituacaoPm } from './situacao-pm'

@Entity('pm_situacao', { schema: 'public', synchronize: false })
export class PmSituacao {
  @PrimaryColumn('int')
  pms_codigo: number

  @Column('int')
  spm_codigo: number

  @Column('varchar')
  pes_pm: string

  @Column('varchar')
  pms_status: string

  @Column('date')
  pms_data_inicial: Date

  @Column('date')
  pms_data_final: Date

  @ManyToOne(() => SituacaoPm, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'spm_codigo', referencedColumnName: 'spm_codigo' })
  tipo_situacao_pm: SituacaoPm
}
