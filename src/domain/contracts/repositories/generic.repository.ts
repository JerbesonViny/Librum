export interface Create<TEntity, TId> {
  create(entity: TEntity): Promise<TId | null>;
}
