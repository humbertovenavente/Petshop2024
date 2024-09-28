
import './App.css';
import Login from './Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup';
import Forgotpassword from './Forgotpassword';
import Admin from './admin';
import Emp from './emp';
import User from './user';
import Footer from './footer';
import Header from './header';
import Guest from './guest';


function App() {
  return (
   <BrowserRouter>
    <Routes>
    <Route path='/' element={ <Login/>}></Route>
    <Route path='/signup' element={ <Signup/>}></Route>
    <Route path='/forgotpassword' element={ <Forgotpassword/>}></Route>
    <Route path='/admin' element={ <Admin/>}></Route>
    <Route path='/emp' element={ <Emp/>}></Route>
    <Route path='/user' element={ <User/>}></Route>
    <Route path='/footer' element={ <Footer/>}></Route>
    <Route path='/header' element={ <Header/>}></Route>
    <Route path='/guest' element={ <Guest/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
