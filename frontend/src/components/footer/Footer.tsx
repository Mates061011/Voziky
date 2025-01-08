import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footerWrap">
      <div className="footerBg">
        <Link to="/" className="nav-link">O NÁS</Link>
        <Link to="/faq" className="nav-link">FAQ</Link>
        <Link to="/offer" className="nav-link">NABÍDKA</Link>
        <Link to="/loginAdmin" className="nav-link">ADMIN</Link>
      </div>
    </footer>
  );
};

export default Footer;
