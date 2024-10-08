
import './App.css';
import Login from './Login';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Signup from './Signup';
import Forgotpassword from './Forgotpassword';
import Admin from './admin';
import Emp from './emp';
import User from './user';
import Footer from './footer';
import Header from './header';
import Guest from './guest';
import Account from './Account';
import UserAdmin from './UserAdmin';
import CategoryAdmin from './CategoryAdmin';
import Category from './Category';
import ProductAdmin from './ProductAdmin';
import InventoryAdmin from './inventory';


function App() {

  const userRole = localStorage.getItem('userRole');

  // Función para proteger rutas según el rol
  const ProtectedRoute = ({ children, allowedRoles }) => {
    return allowedRoles.includes(parseInt(userRole)) ? children : <Navigate to="/" />;
  };
  return (
   <BrowserRouter>
    <Routes>
    <Route path='/' element={ <Login/>}></Route>
    <Route path='/signup' element={ <Signup/>}></Route>
    <Route path='/forgotpassword' element={ <Forgotpassword/>}></Route>
    <Route path="/admin" element={<ProtectedRoute allowedRoles={[1, 2, 3]}><Admin /></ProtectedRoute>} />
    <Route path="/emp" element={<ProtectedRoute allowedRoles={[2]}><Emp /></ProtectedRoute>} />
    <Route path="/user" element={<ProtectedRoute allowedRoles={[1]}><User /></ProtectedRoute>} />
    <Route path="/guest" element={<Guest />} />
    <Route path='/footer' element={ <Footer/>}></Route>
    <Route path='/header' element={ <Header/>}></Route>
    <Route path='/Account' element={ <Account/>}></Route>
    <Route path='/UserAdmin' element={ <UserAdmin/>}></Route>
    <Route path='/CategoryAdmin' element={ <CategoryAdmin/>}></Route>
    <Route path='/ProductAdmin' element={ <ProductAdmin/>}></Route>
    <Route path='/Category' element={ <Category/>}></Route>
    <Route path='/inventory' element={ <InventoryAdmin/>}></Route>

    </Routes>
    </BrowserRouter>
  );
}

export default App;
