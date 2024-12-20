import Logo from "./SiteLogo.svg";
import './navigation.css';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);

    // Hide breadcrumb if the path is "/"
    if (location.pathname === "/") {
        return (
            <div className="navigation">
                <div className="navigation-wrap">
                    <div className="logo-cont">
                        <Link to="/"><img src={Logo} alt="Logo" /></Link>
                    </div>
                    <div className="nav-links-cont">
                        <p className="nav-link">O NÁS</p>
                        <p className="nav-link">FAQ</p>
                        <p className="nav-link">NABÍDKA</p>
                    </div>
                </div>
            </div>
        );
    }

    // Add the Home path as the first breadcrumb item
    const breadcrumbItems = [
        <Breadcrumb.Item key="/">
            <Link to="/">Home</Link>
        </Breadcrumb.Item>,
        ...pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>{url.replace('/', '')}</Link>
                </Breadcrumb.Item>
            );
        })
    ];

    return (
        <div className="navigation">
            <div className="navigation-wrap">
                <div className="logo-cont">
                    <Link to="/"><img src={Logo} alt="Logo" /></Link>
                </div>
                <div className="nav-links-cont">
                    <p className="nav-link">O NÁS</p>
                    <p className="nav-link">FAQ</p>
                    <p className="nav-link">NABÍDKA</p>
                </div>
            </div>
            <div className="breadcrumb-wrap">
                <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            </div>
        </div>
    );
}
