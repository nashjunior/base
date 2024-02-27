import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('graduacao', { schema: 'public', synchronize: false })
export class Graduacao {
  @PrimaryGeneratedColumn()
  gra_codigo: number

  @Column('text', { nullable: false })
  gra_nome: string

  @Column('text')
  gra_sigla: string

  @Column('varchar')
  gra_oficial: string
}
