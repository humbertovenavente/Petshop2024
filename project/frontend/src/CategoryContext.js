import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Crear el contexto
const CategoryContext = createContext();

// Proveedor del contexto
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  // Función para obtener categorías del backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.131/category.php');
      setCategories(response.data); // Guardar las categorías en el contexto
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Obtener categorías cuando el componente se monta
  useEffect(() => {
    fetchCategories();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  return (
    <CategoryContext.Provider value={{ categories, setCategories, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook para usar el contexto
export const useCategory = () => {
  return useContext(CategoryContext);
}; 
