import logo from './logo.svg';
import './App.css';
import Login from './Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup';
import Forgotpassword from './Forgotpassword';


function App() {
  return (
   <BrowserRouter>
    <Routes>
    <Route path='/' element={ <Login/>}></Route>
    <Route path='/signup' element={ <Signup/>}></Route>
    <Route path='/forgotpassword' element={ <Forgotpassword/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
