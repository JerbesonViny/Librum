export type CreateLoanInput = {
  userId: string;
  bookId: string;
};

export type ListLoansInput = {
  page: number;
  pageSize: number;
};
