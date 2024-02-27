import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Unidade } from '../pessoa/unidade'

@Entity('boletim', { schema: 'public', synchronize: false })
export class Boletim {
  @PrimaryColumn('int4')
  bol_codigo: number

  @Column('int4')
  bol_numero: number

  @Column('int4')
  bol_ano: number

  @Column('date')
  bol_data: string

  @Column('varchar')
  pes_unidade: string

  @ManyToOne(() => Unidade)
  @JoinColumn({ name: 'pes_unidade', referencedColumnName: 'pes_codigo' })
  unidade?: Unidade
}
