import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm'
import { GrupoUsuario } from './grupo-usuario'

@Entity('usuarios', { schema: 'seg', synchronize: false })
export class Usuario {
  @PrimaryColumn('varchar')
  usu_codigo: string

  @Column('varchar')
  usu_senha: string

  @OneToMany(() => GrupoUsuario, (grupoUsuario) => grupoUsuario.usu_codigo)
  grupos_usuarios: GrupoUsuario[]
}
