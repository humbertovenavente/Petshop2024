// Category.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function Category() {
    const [products, setProducts] = useState([]); // Estado para productos filtrados
    const [categories, setCategories] = useState([]); // Estado para categorías
    const [topProducts, setTopProducts] = useState([]); // Estado para productos destacados
    const [filters, setFilters] = useState({
        category_id: '', 
        min_price: '',
        max_price: ''
    });
    const [selectedCategories, setSelectedCategories] = useState([]); // Categorías seleccionadas
    const [categoryDescriptions, setCategoryDescriptions] = useState({}); // Descripciones de categorías

    // Obtener las categorías y sus descripciones al cargar el componente
    useEffect(() => {
        axios.get('http://172.16.69.227/getSelectedCategories.php')
            .then(response => {
                const descriptions = {};
                const selected = response.data.filter(cat => cat.selected); // Solo categorías seleccionadas
                selected.forEach(category => {
                    descriptions[category.id_category] = category.description || '';
                });

                setCategories(response.data);
                setSelectedCategories(selected.map(cat => cat.id_category)); // Solo IDs seleccionados
                setCategoryDescriptions(descriptions);
            })
            .catch(error => {
                console.error("Error al obtener categorías: ", error);
            });
    }, []);

    // Obtener los productos destacados
    useEffect(() => {
        axios.get('http://172.16.69.227/topProducts.php')
            .then(response => {
                const productsData = Array.isArray(response.data) ? response.data : [];
                setTopProducts(productsData);
            })
            .catch(error => {
                console.error("Error al obtener productos destacados: ", error);
                setTopProducts([]); // En caso de error, definimos como un array vacío
            });
    }, []);

    // Manejar cambios en el formulario de búsqueda
    const handleInputChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Buscar productos
    const searchProducts = () => {
        const minPrice = parseFloat(filters.min_price);
        const maxPrice = parseFloat(filters.max_price);

        if (minPrice < 1 || (maxPrice !== '' && maxPrice < 1)) {
            alert('Both Minimum Price and Maximum Price must be at least 1.');
            return;
        }
        if (maxPrice <= minPrice) {
            alert('Maximum Price must be greater than Minimum Price.');
            return;
        }

        if (filters.category_id === '' || filters.min_price === '' || filters.max_price === '') {
            alert('It must have a value.');
            return;
        }

        axios.post('http://172.16.69.227/searchCategory.php', {
            category_id: filters.category_id, 
            min_price: filters.min_price ? filters.min_price : 0, 
            max_price: filters.max_price ? filters.max_price : Infinity
        })
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.error("Error al buscar productos: ", error);
        });
    };

    // Configuración del carrusel
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
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
                                <Form.Label>Minimun Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="min_price"
                                    onChange={handleInputChange}
                                    placeholder="Minimun Price"
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

                <hr /> {/* Separador entre las categorías y el carrusel */}

                {/* Carrusel de productos destacados */}
                <h3>Top Products by Inventory</h3>
                {topProducts.length > 0 ? (
                    <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={3000}>
                        {topProducts.map((product, index) => (
                            <div key={index} className="p-3">
                                <Card className="h-100 shadow-sm">
                                    <div className="d-flex justify-content-center" style={{ height: '300px', overflow: 'hidden' }}>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <p>No Image Available</p>
                                        )}
                                    </div>
                                    <Card.Body className="text-center">
                                        <Card.Title>{product.name || 'No Name Available'}</Card.Title>
                                        <Card.Text>Inventory: {product.inventory || 'Not Available'}</Card.Text>
                                        <Link to={`/ProductDetails/${product.id_product}`}>
                                            <Button variant="primary">View Product</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <p>No top products available</p>
                )}

                <hr /> {/* Separador para la nueva sección */}

                {/* Nueva sección: Tabla dinámica de categorías */}
                <h3>Category Table</h3>
                <Tabs defaultActiveKey={0} id="category-tabs" className="mb-3">
                    {selectedCategories.map((id_category, index) => {
                        const category = categories.find(cat => cat.id_category === id_category);
                        return (
                            <Tab eventKey={index} title={category?.name || `Section ${index + 1}`} key={id_category}>
                                <div className="p-3">
                                    <h5>{category?.name}</h5>
                                    <p>{categoryDescriptions[id_category]}</p>
                                </div>
                            </Tab>
                        );
                    })}
                </Tabs>
            </main>
            <Footer />
        </div>
    );
}

export default Category;
