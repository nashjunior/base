export default interface RepositoryInterface<T> {
  criar(entity: T): Promise<T>
  atualizar(entity: T): Promise<T>
  buscarPeloId(id: number): Promise<T | null>
  remover(id: number): Promise<void>
}
