import './App.css';
import { Routes, Route, HashRouter } from "react-router-dom";
import { Suspense, lazy } from 'react';
import Navigation from './components/navigation/Navigation';
import { ConfigProvider } from 'antd'; // Import ConfigProvider
import { DateProvider } from './context/DateContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/userContext';
import Footer from './components/footer/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminPanelItem from './pages/adminpanel/AdminPanelItem';

// Lazy load the components for routes
const Mainpage = lazy(() => import("./pages/mainpage/Mainpage"));
const Cart = lazy(() => import('./pages/cart/Cart'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const AdminPanel = lazy(() => import('./pages/adminpanel/AdminPanel'));

function App() {
  return (
    <div className="App">
      <DateProvider>
      <UserProvider>
        <CartProvider>
          <HashRouter>
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
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Mainpage />} />
                    <Route path="/Objednat" element={<Cart />} />
                    <Route path='/loginAdmin' element={<Admin />} />
                    <Route element={<PrivateRoute redirectPath="/loginAdmin" />}>
                      <Route path="/adminPanel" element={<AdminPanel />} />
                      <Route path="/adminPanelItem" element={<AdminPanelItem />} />
                    </Route>
                  </Routes>
                </Suspense>
                <Footer/>
              </div>
            </ConfigProvider>
          </HashRouter>
        </CartProvider>
        </UserProvider>
      </DateProvider>
    </div>
  );
}

export default App;
