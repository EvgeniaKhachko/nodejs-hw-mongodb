
export const parsePaginationParams = (query) => {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const perPage = query.perPage ? parseInt(query.perPage, 10) : 10;
  
    return { page, perPage };
  };
  