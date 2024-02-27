import { ViewColumn, ViewEntity } from 'typeorm'

@ViewEntity('v_boletins', { synchronize: false })
export class VBoletim {
  @ViewColumn()
  bol_codigo: number

  @ViewColumn()
  nrboletim: string

  @ViewColumn()
  nrboletimpublicacao: string
}
