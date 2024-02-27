import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { PessoaPm } from './pessoa-pm'
import { IPessoa } from '@/_domain/pessoas/repositories/pessoas-repository-interface'

@Entity('pessoa', { schema: 'public', synchronize: false })
export class Pessoa implements IPessoa {
  @PrimaryColumn('varchar')
  pes_codigo: string

  @Column('varchar')
  pes_nome: string

  @Column('varchar')
  pes_tipo: string

  @OneToOne(() => PessoaPm)
  @JoinColumn({ name: 'pes_codigo' })
  pessoa_pm?: PessoaPm
}
