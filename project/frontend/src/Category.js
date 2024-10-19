import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

function Category() {
    const [products, setProducts] = useState([]); 
    const [categories, setCategories] = useState([]);  
    const [filters, setFilters] = useState({
        category_id: '', 
        min_price: '',
        max_price: ''
    });

    useEffect(() => {
        axios.get('http://192.168.0.131/category.php')
        .then(response => {
            console.log('Categorías obtenidas:', response.data);
            setCategories(response.data);
        })
        .catch(error => {
            console.error("Error al obtener categorías: ", error);
        });
    }, []);

    const handleInputChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const searchProducts = () => {
        console.log("Filtros enviados:", filters);
        axios.post('http://192.168.0.131/searchCategory.php', {
            category_id: filters.category_id, 
            min_price: filters.min_price,
            max_price: filters.max_price
        })
        .then(response => {
            console.log('Respuesta del backend:', response.data);
            setProducts(response.data);
        })
        .catch(error => {
            console.error("Error al buscar productos: ", error);
        });
    };

    return (
        <div id="root">
            <Header />
            <main className="container my-5">
                <h1>Categories and Search</h1>
                <h4>Search for products</h4>

                {/* Formulario de búsqueda */}
                <Form className="mb-4">
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select" 
                                    name="category_id"
                                    onChange={handleInputChange}
                                    value={filters.category_id}
                                >
                                    <option value="">Select a Category</option>
                                    {categories.map(category => (
                                        <option key={category.id_category} value={category.id_category}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Min Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="min_price"
                                    onChange={handleInputChange}
                                    placeholder="Min Price"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Max Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="max_price"
                                    onChange={handleInputChange}
                                    placeholder="Max Price"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" onClick={searchProducts}>Search</Button>
                </Form>

                {/* Mostrar resultados de productos */}
                <h3>Search Results</h3>
                <Row>
    {Array.isArray(products) && products.length > 0 ? (
        products.map((product, index) => (
            <Col key={index} md={4} className="mb-4">
                <Card>
                    <Card.Body>
                        {/* Mostrar la imagen si está disponible */}
                        {product.image ? (
                            <img
                                src={`data:image/jpeg;base64,${product.image}`} 
                                alt={product.name}
                                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                            />
                        ) : (
                            <p>No Image Available</p>
                        )}
                        <Card.Title>{product.name || 'No Name Available'}</Card.Title>
                        <Card.Text>Price: ${product.price || 'Not Available'}</Card.Text>
                        <Card.Text>Category: {product.category_name || 'No Category'}</Card.Text>
                        <Link to={`/ProductDetails/${product.id_product}`}>
                            <Button variant="primary">View Product</Button>
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        ))
    ) : (
        <p>No products found</p>
    )}
</Row>


                <hr /> {/* Separador entre la búsqueda y las categorías */}

                {/* Mostrar categorías */}
                <h3>Categories</h3>
                <Row>
                    {categories.length > 0 ? (
                        categories.map(category => (
                            <Col key={category.id_category} md={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{category.name}</Card.Title>
                                        <Link to={`/category/${category.id_category}/${category.name}`}>
                                            <Button variant="primary">View Category</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No categories available</p>
                    )}
                </Row>
            </main>
            <Footer />
        </div>
    );
}

export default Category;
