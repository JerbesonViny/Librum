export interface Create<TEntity, TId> {
  create(entity: TEntity): Promise<TId | null>;
}

export interface FindMany<TInput, TOutput> {
  findMany(input: TInput): Promise<TOutput[] | null> | TOutput[] | null;
}

export interface FindOne<TInput, TOutput> {
  findOne(input: TInput): Promise<TOutput | null> | TOutput | null;
}
