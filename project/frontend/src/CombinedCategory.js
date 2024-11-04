import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function CombinedCategory() {
    const { id1, id2 } = useParams();
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        fetch(`http://192.168.0.74/CombinedCategory.php?id1=${id1}&id2=${id2}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [id1, id2]);

    return (
        <div>
            <h1>Products in Both Categories</h1>
            {products.length === 0 ? (
                <p>No products found for these categories</p>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id_product} className="product-card">
                            <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CombinedCategory;
