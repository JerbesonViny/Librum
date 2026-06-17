export interface Create<TEntity, TId> {
  create(entity: TEntity): Promise<TId | null>;
}

export interface FindMany<TInput, TOutput> {
  findMany(input: TInput): Promise<TOutput[] | null> | TOutput[] | null;
}

export interface FindOne<TInput, TOutput> {
  findOne(input: TInput): Promise<TOutput | null> | TOutput | null;
}

export type Pagination = {
  page: number;
  pageSize: number;
};

export type PaginatedOutput<TItem> = {
  items: TItem[];
  records: number;
  page: number;
};

export interface Paginated<TInput extends Pagination, TItem> {
  paginate(
    input: TInput,
  ): Promise<PaginatedOutput<TItem> | null> | PaginatedOutput<TItem> | null;
}
