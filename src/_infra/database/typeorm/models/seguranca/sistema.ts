import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sistemas', { schema: 'seg', synchronize: false })
export class Sistema {
  @PrimaryGeneratedColumn()
  sis_codigo: number

  @Column('varchar')
  sis_nome: string

  @Column('varchar')
  sis_sigla: string

  @Column('boolean')
  usuario_padrao_acessa: boolean

  @Column('boolean')
  sgpm: boolean
}
