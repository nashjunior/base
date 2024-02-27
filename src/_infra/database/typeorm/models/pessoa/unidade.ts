import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('unidade', { schema: 'public', synchronize: false })
export class Unidade {
  @PrimaryColumn('int4')
  uni_codigo: number

  @Column('text')
  uni_nome: string

  @Column('varchar')
  uni_sigla: string

  @Column('int')
  uni_superior: number

  @Column('int')
  uni_grd_cmdo: number

  @Column('int')
  uni_lob: number

  @Column('varchar')
  pes_codigo: string

  @Column('varchar')
  uni_boletim_caminho: string
}
