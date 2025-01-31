
export const parseSortParams = (query) => {
  const { sortBy = 'name', sortOrder = 'asc' } = query;
  console.log("Sort Parameters:", { sortBy, sortOrder });
  
  return { sortBy, sortOrder };
};

