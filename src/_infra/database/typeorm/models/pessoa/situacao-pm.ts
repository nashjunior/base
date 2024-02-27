import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('situacao_pm', { schema: 'public', synchronize: false })
export class SituacaoPm {
  @PrimaryColumn('int')
  spm_codigo: number

  @Column('int')
  tsp_codigo: number

  @Column('varchar')
  spm_nome: string

  @Column('varchar')
  spm_tipo: string
}
