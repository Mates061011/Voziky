import './App.css';
import Mainpage from "./pages/mainpage/Mainpage";
import About from './pages/about/About';
import Faq from './pages/faq/Faq';
import Nabidka from './pages/nabidka/Nabidka';
import Cart from './pages/cart/Cart'; // Import the Cart page
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './components/navigation/Navigation';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Navigation />
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/About" element={<About />} />
            <Route path="/FAQ" element={<Faq />} />
            <Route path="/Nabidka" element={<Nabidka />} />
            <Route path="/Cart" element={<Cart />} /> {/* Add the route for the Cart page */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
