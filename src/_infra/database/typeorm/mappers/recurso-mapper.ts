import { RecursoTypeOrm } from '../models/segep/recurso'
import { Recurso } from '@/_domain/avaliacoes/entities/recurso'

export class RecursoMapper {
  static toDomain(entityORM: RecursoTypeOrm): Recurso {
    const entity = new Recurso(entityORM)

    if (entityORM.termos_sga) {
      entity.termos_sga = entityORM.termos_sga
    }

    if (entityORM.pessoa_deletado_por) {
      entity.alteraPessoaDeletadorPor(entityORM.pessoa_deletado_por)
    }
    if (entityORM.pessoa_membro_cgp_1) {
      entity.alteraPessoaMembroCgp1(entityORM.pessoa_membro_cgp_1)
    }
    if (entityORM.pessoa_membro_cgp_2) {
      entity.alteraPessoaMembroCgp2(entityORM.pessoa_membro_cgp_2)
    }
    if (entityORM.pessoa_membro_cgp_3) {
      entity.alteraPessoaMembroCgp3(entityORM.pessoa_membro_cgp_3)
    }
    if (entityORM.pessoa_respondido_cgp) {
      entity.alteraPessoaRespondidoCgp(entityORM.pessoa_respondido_cgp)
    }
    if (entityORM.pessoa_respondido_comissao) {
      entity.alteraPessoaRespondidoComissao(
        entityORM.pessoa_respondido_comissao,
      )
    }

    return entity
  }

  static toOrm(entity: Recurso): RecursoTypeOrm {
    type PartialEntityTypeOrm = Omit<RecursoTypeOrm, 'id_recurso'> & {
      id_recurso?: number
    }
    const entityOrm: PartialEntityTypeOrm = {
      id_recurso: entity.id_recurso,
      criado_em: entity.criado_em,
      deferido_cgp: entity.deferido_cgp,
      deferido_comissao: entity.deferido_comissao,
      deletado_em: entity.deletado_em,
      deletado_por: entity.deletado_por ? entity.deletado_por.valor : null,
      descricao: entity.descricao.valor,
      id_avaliacao: entity.id_avaliacao,
      id_membro_cgp_1: entity.id_membro_cgp_1
        ? entity.id_membro_cgp_1.valor
        : null,
      id_membro_cgp_2: entity.id_membro_cgp_2
        ? entity.id_membro_cgp_2.valor
        : null,
      id_membro_cgp_3: entity.id_membro_cgp_3
        ? entity.id_membro_cgp_3.valor
        : null,
      id_posto_membro1_na_epoca: entity.id_posto_membro1_na_epoca,
      id_posto_membro2_na_epoca: entity.id_posto_membro2_na_epoca,
      id_posto_membro3_na_epoca: entity.id_posto_membro3_na_epoca,
      path_documento: entity.path_documento,
      path_documento_cgp: entity.path_documento_cgp,
      path_documento_comissao: entity.path_documento_comissao,
      respondido_cgp_em: entity.respondido_cgp_em,
      respondido_cgp_por: entity.respondido_cgp_por
        ? entity.respondido_cgp_por.valor
        : null,
      respondido_comissao_em: entity.respondido_comissao_em,
      respondido_comissao_por: entity.respondido_comissao_por
        ? entity.respondido_comissao_por.valor
        : null,
      resposta_cgp: entity.resposta_cgp ? entity.resposta_cgp.valor : null,
      resposta_comissao: entity.resposta_comissao
        ? entity.resposta_comissao.valor
        : null,
      status: entity.status,
    }

    return entityOrm as RecursoTypeOrm
  }
}
