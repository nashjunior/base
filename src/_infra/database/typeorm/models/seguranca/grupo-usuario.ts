import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Grupo } from './grupo'

@Entity('grupos_usuarios', { schema: 'seg', synchronize: false })
export class GrupoUsuario {
  @PrimaryColumn('int')
  usu_codigo: string

  @PrimaryColumn('int')
  gru_codigo: number

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'gru_codigo' })
  grupo: Grupo
}
