export class RecursoNaoEncotradoError extends Error {
  constructor() {
    super('Recurso não encontrado')
  }
}
