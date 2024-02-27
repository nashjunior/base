import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Sistema } from './sistema'

@Entity('grupos', { schema: 'seg', synchronize: false })
export class Grupo {
  @PrimaryGeneratedColumn()
  gru_codigo: number

  @Column('int')
  sis_codigo: number

  @Column('varchar')
  gru_nome: string

  @ManyToOne(() => Sistema)
  @JoinColumn({ name: 'sis_codigo' })
  sistema?: Sistema
}
