import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';
import Header from './header';
import Footer from './footer';

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState(''); 
  const [messageType, setMessageType] = useState(''); 
  const [replyingTo, setReplyingTo] = useState(null); 
  const [userId, setUserId] = useState(null);  
  const [editingComment, setEditingComment] = useState(null); 
  const [editText, setEditText] = useState(''); 
  const [showReplyModal, setShowReplyModal] = useState(false); 
  const [replyText, setReplyText] = useState(''); 
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('email'); 

  // Obtener el id_user basado en el email
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.post('http://192.168.0.74/getUserId.php', { email });
        if (response.data.id_user) {
          setUserId(response.data.id_user); 
        } else {
          console.log("Error obteniendo id_user:", response.data.error);
          setMessage("Error: No se encontró el usuario.");
        }
      } catch (error) {
        console.error("Error al obtener id_user:", error);
        setMessage("Error al obtener el id_user.");
      }
    };

    if (email) {
      fetchUserId(); 
    }
  }, [email]);

  const fetchProductDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://192.168.0.74/ProductDetails.php?productId=${productId}`);
      setProduct(response.data.product);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleAddComment = async () => {
    console.log("Intentando agregar comentario..."); // Verifica que esta línea se imprima

    if (newComment.trim() === '') {
        setMessage('Please write a comment before submitting.');
        setMessageType('error');
        return;
    }

    if (!userId) {
        setMessage('No se puede añadir comentario sin iniciar sesión.');
        setMessageType('error');
        return;
    }

    try {
        console.log("Datos enviados:", {
            id_product: productId,
            id_user: userId,
            comment: newComment,
            id_parent: replyingTo
        }); // Muestra los datos que se enviarán

        const response = await axios.post('http://192.168.0.74/AddComment.php', {
            id_product: productId,
            id_user: userId,
            comment: newComment,
            id_parent: replyingTo
        });

        if (response.data.status === 'success') {
            setMessage(response.data.message); 
            setMessageType('success');
            setNewComment('');
            setReplyingTo(null); 
            fetchProductDetails(); 
        } else {
            setMessage(response.data.message);
            setMessageType('error');
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        setMessage('Error while adding comment.');
        setMessageType('error');
    }
};


  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure to delete this message?");
    if (!confirmDelete) return; 

    try {
      const response = await axios.post('http://192.168.0.74/DeleteComment.php', {
        id_comment: commentId
      });

      if (response.data.status === 'success') {
        setMessage(response.data.message);
        setMessageType('success');
        fetchProductDetails(); 
      } else {
        setMessage(response.data.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      setMessage('Error al eliminar comentario.');
      setMessageType('error');
    }
  };

  const handleEditComment = (commentId, text) => {
    setEditingComment(commentId);
    setEditText(text); 
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) {
      setMessage('Please write a comment before submitting.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.74/UpdateComment.php', {
        id_comment: editingComment,
        comment: editText
      });

      if (response.data.status === 'success') {
        setMessage(response.data.message);
        setMessageType('success');
        setEditingComment(null); 
        setEditText(''); 
        fetchProductDetails(); 
      } else {
        setMessage(response.data.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
      setMessage('Error al actualizar comentario.');
      setMessageType('error');
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setShowReplyModal(true); 
  };

  const handleAddReply = async () => {
    if (!replyText.trim()) {
      setMessage('Please write a reply before submitting.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.74/AddComment.php', {
        id_product: productId,
        id_user: userId,
        comment: replyText,
        id_parent: replyingTo
      });

      if (response.data.status === 'success') {
        setMessage(response.data.message);
        setMessageType('success');
        setReplyText('');
        setReplyingTo(null); 
        setShowReplyModal(false); 
        fetchProductDetails(); 
      } else {
        setMessage(response.data.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      setMessage('Error while adding reply.');
      setMessageType('error');
    }
  };

  // Agregar el producto al carrito
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newProduct = { ...product, quantity };
    const updatedCart = [...cart, newProduct];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`You added ${quantity} article(s) in the cart`);
  };

  const handleQuantityChange = (e) => {
    const selectedQuantity = parseInt(e.target.value);
    if (selectedQuantity > product.inventory) {
      setError(`Almost out of stock, there is only ${product.inventory} products available.`);
    } else {
      setError('');
      setQuantity(selectedQuantity);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Renderizar un comentario y sus replies recursivamente con colores para cada nivel
  const renderComment = (comment, level = 0) => {
    const colors = [ '#B0B0B0', '#E6E6FA', '#C8E6C9', '#ADD8E6', '#FADADD', '#F5F5DC', '#FFD580'];

    return (
      <li key={comment.id_comment} style={{ backgroundColor: colors[level % colors.length], padding: '10px', marginBottom: '5px', borderRadius: '5px' }}>
        {editingComment === comment.id_comment ? (
          <>
            <Form.Control
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <Button variant="primary" onClick={handleUpdateComment}>Update</Button>
            <Button variant="secondary" onClick={() => setEditingComment(null)}>Cancel</Button>
          </>
        ) : (
          <>
            <p><strong>{comment.name}:</strong> {comment.comment}</p>
            <Button variant="link" onClick={() => handleReply(comment.id_comment)}>Reply</Button>

            {comment.id_user === userId && (
              <>
                <Button variant="link" onClick={() => handleEditComment(comment.id_comment, comment.comment)}>Edit</Button>
                <Button variant="link" onClick={() => handleDeleteComment(comment.id_comment)}>Delete</Button>
              </>
            )}

            
            <ul>
              {comments.filter(c => c.id_parent === comment.id_comment).map(reply => renderComment(reply, level + 1))}
            </ul>
          </>
        )}
      </li>
    );
  };

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        <Button variant="secondary" onClick={handleGoBack} className="mb-3">Back</Button>

        <h1>{product.name}</h1>

        {product.image ? (
          <img
            src={`data:${product.file_type};base64,${product.image}`}
            alt={product.name}
            style={{ width: '300px', height: '300px', objectFit: 'cover' }}
          />
        ) : (
          <p>No image available</p>
        )}

        <p><strong>Name:</strong> {product.name || 'No available'}</p>
        <p><strong>Description:</strong> {product.description || 'No available'}</p>
        <p><strong>Price:</strong> ${product.price || 'No available'}</p>
        <p><strong>Color:</strong> {product.color || 'No available'}</p>
        <p><strong>Size:</strong> {product.size || 'No available'}</p>
        <p><strong>Inventory:</strong> {product.inventory || 'No available'}</p>

        <h3>Add to Cart</h3>
        <Form.Group>
          <Form.Label>Quantity</Form.Label>
          <Form.Control as="select" value={quantity} onChange={handleQuantityChange} disabled={product.stock === 0}>
            {[...Array(10).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </Form.Control>
        </Form.Group>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button
          variant="primary"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || quantity > product.inventory}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add article'}
        </Button>

        {/* Sección de comentarios */}
        <h3 className="mt-5">Comments</h3>
        <div>       
           {message && (
          <p style={{ color: messageType === 'success' ? 'green' : 'red' }}>{message}</p>
        )}
        </div>


        <ul>
          {comments.filter(c => c.id_parent === null).map(comment => renderComment(comment))}
        </ul>

        {/* Añadir comentario */}
        <h3 className="mt-5">Add a Comment</h3>
     
        <Form.Control
          type="text"
          placeholder={replyingTo ? "Replying to comment..." : "Write a comment..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddComment}>
          {replyingTo ? "Reply" : "Add Comment"}
        </Button>

        {/* Modal para escribir un Reply */}
        <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Reply to Comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              type="text"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReplyModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddReply}>Reply</Button>
          </Modal.Footer>
        </Modal>
      </main>
      <Footer />
    </div>
  );
}

export default ProductDetails;
