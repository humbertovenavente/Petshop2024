import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const CategoryContext = createContext();

// Proveedor del contexto
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook para usar el contexto
export const useCategory = () => {
  return useContext(CategoryContext);
};
