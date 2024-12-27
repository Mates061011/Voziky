import './App.css';
import Mainpage from "./pages/mainpage/Mainpage";
import Cart from './pages/cart/Cart'; // Import the Cart page
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './components/navigation/Navigation';
import Admin from './pages/admin/Admin';
import AdminPanel from './pages/adminpanel/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import { ConfigProvider } from 'antd'; // Import ConfigProvider
import { DateProvider } from './context/DateContext';
import Footer from './components/footer/Footer';

function App() {
  return (
    <div className="App">
      <DateProvider>
        <BrowserRouter>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#FF6832',
                colorError: '#A20B0B',
              },
            }}
          >
            <div className="content">
              <Navigation />
              <Routes>
                <Route path="/" element={<Mainpage />} />
                <Route path="/Kosik" element={<Cart />} />
                <Route path='/loginAdmin' element={<Admin />} />
                <Route element={<PrivateRoute redirectPath="/loginAdmin" />}>
                  <Route path="/adminPanel" element={<AdminPanel />} />
                </Route>
              </Routes>
              <Footer/>
            </div>
          </ConfigProvider>
        </BrowserRouter>
      </DateProvider>
    </div>
  );
}

export default App;
