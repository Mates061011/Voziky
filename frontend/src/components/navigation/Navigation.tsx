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
                    <p className="nav-link">O NÁS</p>
                    <p className="nav-link">FAQ</p>
                    <p className="nav-link">NABÍDKA</p>    
                </div>
            </div>
        </div>
    )
}
