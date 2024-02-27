import { ViewColumn, ViewEntity } from 'typeorm'

@ViewEntity('v_opms_atuais', { schema: 'public', synchronize: false })
export class VOpmAtual {
  @ViewColumn()
  uni_codigo: number

  @ViewColumn()
  uni_nome: string

  @ViewColumn()
  uni_sigla: string

  @ViewColumn()
  uni_superior: number

  @ViewColumn()
  uni_grd_cmdo: number

  @ViewColumn()
  bisavo_codigo: number

  @ViewColumn()
  operacional: string

  @ViewColumn()
  especializada: string
}
