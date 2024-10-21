import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function CombinedCategory() {
  const { mainCategoryId, relatedCategoryId } = useParams(); // Obtener las categorías desde los parámetros de la URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Hacer una petición para obtener los productos que tienen ambas categorías
    fetch(`http://192.168.0.131/CombinedCategory.php?mainCategoryId=${mainCategoryId}&relatedCategoryId=${relatedCategoryId}`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, [mainCategoryId, relatedCategoryId]);

  return (
    <div>
      <h1>Productos para las categorías seleccionadas</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              {/* Mostrar la imagen del producto usando base64 */}
              <img src={`data:${product.file_type};base64,${product.image}`} alt={product.name} />
              <h2>{product.name}</h2>
              <p>Precio: ${product.price}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron productos para esta combinación de categorías.</p>
        )}
      </div>
    </div>
  );
}

export default CombinedCategory;
