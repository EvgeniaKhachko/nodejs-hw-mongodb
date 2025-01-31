
export const parseFilterParams = (query) => {
    const filter = {};
  
    // Перевірка на параметри фільтрації 
    if (query.type) {
      filter.contactType = query.type.trim();  // фільтруємо за типом контакту
    }
    
    if (query.isFavourite) {
      filter.isFavourite = query.isFavourite === 'true';  // фільтруємо за isFavourite
    }
  
    return filter;
  };
  