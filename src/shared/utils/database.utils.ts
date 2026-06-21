type BuildPaginationParamsInput = {
  page?: number;
  pageSize?: number;
};

export function buildPaginationParams({
  page,
  pageSize,
}: BuildPaginationParamsInput) {
  const __page = !page || Number(page) <= 0 ? 1 : Number(page);
  const __pageSize = pageSize || 10;
  const __skip = __pageSize * (__page - 1);

  return {
    page: __page,
    pageSize: __pageSize,
    skip: __skip,
  };
}
