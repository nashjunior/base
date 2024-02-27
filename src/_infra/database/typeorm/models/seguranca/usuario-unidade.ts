import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Unidade } from '../pessoa/unidade'

@Entity('usuarios_unidade', { schema: 'public', synchronize: false })
export class UsuarioUnidade {
  @PrimaryColumn('int')
  usu_codigo: string

  @PrimaryColumn('int')
  uni_codigo: number

  @PrimaryColumn('int')
  sis_codigo: number

  @ManyToOne(() => Unidade)
  @JoinColumn({ name: 'uni_codigo' })
  unidade: Unidade
}
