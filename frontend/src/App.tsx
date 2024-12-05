import './App.css';
import Mainpage from "./pages/mainpage/Mainpage";
import Cart from './pages/cart/Cart'; // Import the Cart page
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './components/navigation/Navigation';
import Admin from './pages/admin/Admin';
import AdminPanel from './pages/adminpanel/AdminPanel';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Navigation />
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path='/login' element={<Admin/>}/>
            <Route element={<PrivateRoute redirectPath="/login" />}>
              <Route path="/adminPanel" element={<AdminPanel />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
