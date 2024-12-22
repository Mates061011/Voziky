import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <div className="footerBg">
        <p className="nav-link">O NÁS</p>
        <p className="nav-link">FAQ</p>
        <p className="nav-link">NABÍDKA</p>
        <Link to='/loginAdmin'>ADMIN</Link>
    </div>
  )
}

export default Footer
