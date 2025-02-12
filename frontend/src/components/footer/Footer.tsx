import "./footer.css";
import { Link } from "react-router-dom";
import fbIcon from '../../assets/socialIcons/FB.svg';
import igIcon from '../../assets/socialIcons/IG.svg';
import ytIcon from '../../assets/socialIcons/YT.svg';
const Footer = () => {
  return (
    <footer className="footerWrap">
      <div className="footerBg">
        <div className="footerCont">
          <div className="footerLinks">
            <Link to="/" className="nav-link">O nás</Link>
            <Link to="/FAQ" className="nav-link">FAQ</Link>
            <Link to="/Contact" className="nav-link">Kontakt</Link>
            <Link to="/loginAdmin" className="nav-link">Admin</Link>
          </div>
          <div className="footerSocials">
            <p>SLEDUJ TE NÁS</p>
            <div className="footerSocialsSub">
              <a href=""><img src={fbIcon} alt="" /></a>
              <a href=""><img src={igIcon} alt="" /></a>
              <a href=""><img src={ytIcon} alt="" /></a>
            </div>
          </div>
        </div>
        <div className="footerCont">
          <p>© Půjčovna vozíku THULE 2025</p>
          <p>Zásady ochrany osobních údajů a cookies</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
