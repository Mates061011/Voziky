import Logo from "./SiteLogo.svg";
import './navigation.css';
import { Link } from 'react-router-dom';
export default function Navigation(){
    return(
        
        <div className="navigation">
            <div className="navigation-wrap">
                <div className="logo-cont">
                <Link to="/"><img src={Logo} alt="" /></Link>
                </div>
                <div className="nav-links-cont">
                    <Link to="/About" className="nav-link">O NÁS</Link>
                    <Link to="/FAQ" className="nav-link">FAQ</Link>
                    <Link to="/Nabidka" className="nav-link">NABÍDKA</Link>    
                </div>
            </div>
        </div>
    )
}
