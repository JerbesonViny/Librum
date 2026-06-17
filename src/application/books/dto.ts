export type CreateBookInput = {
  title: string;
  description?: string;
  releaseDate: string;
  authorIds: string[];
};

export type ListBooksInput = {
  page: number;
  pageSize: number;
};
