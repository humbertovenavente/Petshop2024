import './App.css';
import Login from './Login';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Signup from './Signup';
import Forgotpassword from './Forgotpassword';
import ResetPassword from './ResetPassword';
import Admin from './admin';
import Emp from './emp';
import User from './user';
import Footer from './footer';
import Header from './header';

import ProductDetails from './ProductDetails';

import Account from './Account';
import UserAdmin from './UserAdmin';
import CategoryAdmin from './CategoryAdmin';
import Category from './Category';
import CategoryProducts from './CategoryProducts';

import ProductAdmin from './ProductAdmin';
import InventoryAdmin from './inventory';
import Home from './Home';
import CarouselComponent from './CarouselC';
import ProductCard from './ProductCard';
import VideoComponent from './VideoC';
import VerifyAccount from './VerifyAccount';
import Cart from './Cart';
import Checkout from './Checkout';
import MyOrders from './MyOrders';
import Tracking from './Tracking';
import ManageOrder from './ManageOrder';
import { useEffect } from 'react';  

function App() {
  const userRole = localStorage.getItem('userRole');

  // Efecto para limpiar el localStorage al cerrar el navegador o pestaña
  useEffect(() => {
    // Función para limpiar el localStorage y establecer el rol como guest al cerrar la pestaña
    const handleBeforeUnload = () => {
      localStorage.clear();  // Limpiar todo el localStorage
      localStorage.setItem('userRole', 'guest');  // Asignar el rol de guest para la próxima vez
    };

    // Listener para detectar el evento de cerrar la pestaña o ventana
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Establecer el rol de "guest" si no existe ya un rol en el localStorage
    if (!userRole) {
      localStorage.setItem('userRole', 'guest');
    }

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userRole]);

  // Función para proteger rutas según el rol
  const ProtectedRoute = ({ children, allowedRoles }) => {
    return allowedRoles.includes(parseInt(userRole)) ? children : <Navigate to="/" />;
  };

  return (
   <BrowserRouter>
    <Routes>
    <Route path='/' element={ <Home/>}></Route>
    <Route path='/signup' element={ <Signup/>}></Route>
    <Route path='/forgotpassword' element={ <Forgotpassword/>}></Route>
    <Route path='/ResetPassword' element={ <ResetPassword/>}></Route>
    <Route path="/admin" element={<ProtectedRoute allowedRoles={[1, 2, 3]}><Admin /></ProtectedRoute>} />
    <Route path="/emp" element={<ProtectedRoute allowedRoles={[2]}><Emp /></ProtectedRoute>} />
    <Route path="/user" element={<ProtectedRoute allowedRoles={[1]}><User /></ProtectedRoute>} />
    
    <Route path='/footer' element={ <Footer/>}></Route>
    <Route path='/header' element={ <Header/>}></Route>
    <Route path='/Account' element={ <Account/>}></Route>
    <Route path='/UserAdmin' element={ <UserAdmin/>}></Route>
    <Route path='/CategoryAdmin' element={ <CategoryAdmin/>}></Route>
    <Route path='/ProductAdmin' element={ <ProductAdmin/>}></Route>
    <Route path='/Category' element={ <Category/>}></Route>
    <Route path="/category/:categoryId/:categoryName" element={<CategoryProducts />} />
    <Route path="/ProductDetails/:productId" element={<ProductDetails userRole={userRole} />} />
    <Route path="/ManageOrder" element={<ManageOrder />} />


    <Route path='/inventory' element={ <InventoryAdmin/>}></Route>
    <Route path='/MyOrders' element={ <MyOrders/>}></Route>
    <Route path='/Login' element={ <Login/>}></Route>
    <Route path='/CarouselC' element={ <CarouselComponent/>}></Route>
    <Route path='/ProductC' element={ <ProductCard/>}></Route>
    <Route path='/VideoC' element={ <VideoComponent/>}></Route>
    <Route path='/verify' element={ <VerifyAccount/>}></Route>
    <Route path='/Home' element={ <Home/>}></Route>
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path='/Tracking' element={ <Tracking/>}></Route>
    <Route path="/orderDetails/:orderId" element={<Tracking />} />


    </Routes>
    </BrowserRouter>
  );
}

export default App;