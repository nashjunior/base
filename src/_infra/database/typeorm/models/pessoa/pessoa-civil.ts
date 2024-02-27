import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm'
import { Pessoa } from './pessoa'
import { Unidade } from './unidade'

@Entity('pessoa_civil', { schema: 'public', synchronize: false })
export class PessoaCivil {
  @PrimaryColumn('int')
  civil_codigo: string

  @Column('int')
  cvt_codigo: number

  @Column('int')
  uni_codigo: number

  @OneToOne(() => Pessoa)
  @JoinColumn({ name: 'civil_codigo' })
  pessoa: Pessoa

  @OneToOne(() => Unidade)
  @JoinColumn({ name: 'uni_codigo' })
  opm: Unidade

  @Column('timestamp without time zone')
  data_alteracao: Date

  @Column('varchar')
  usuario_alteracao: string

  @Column('timestamp without time zone')
  data_cadastro: Date

  @Column('varchar')
  usuario_cadastro: string
}
