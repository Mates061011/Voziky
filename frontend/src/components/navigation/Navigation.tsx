import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Logo from "./SiteLogo.svg";
import "./navigation.css";
import { Breadcrumb } from "antd";
import { Badge } from "antd";
import Cart from "../../assets/cart.svg";
import { useCart } from "../../context/CartContext"; // Import the useCart hook

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const { cart } = useCart(); // Access the cart state from the context

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleCartClick = () => {
    localStorage.setItem("currentStep", "0"); // Update localStorage
    navigate("/Objednat"); // Redirect to /Objednat
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    setIsAuthenticated(false); // Update authentication state
    navigate("/"); // Redirect to home page
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Clean up the event listener
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const breadcrumbItems = [
    { title: <Link to="/">Domů</Link> },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return { title: <Link to={url}>{pathSnippets[index]}</Link> };
    }),
  ];
  

  return (
    <nav className="navigation">
      <div className="navigation-wrap">
        <div className="logo-cont">
          <Link to="/">
            <img src={Logo} alt="Company Name Logo" />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links-cont">
          {!isAuthenticated ? (
            <>
              <Link className="nav-link" to="/">
                O NÁS
              </Link>
              <Link className="nav-link" to="/FAQ">
                FAQ
              </Link>
              <Link className="nav-link" to="/Nabidka">
                NABÍDKA
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/adminPanel">
                REZERVACE
              </Link>
              <Link className="nav-link" to="/adminPanelItem">
                PRISLUSENSTVI
              </Link>
              <button className="nav-link logout-button" onClick={handleLogout}>
                ODHLÁSIT SE
              </button>
            </>
          )}
        </div>

        <div className="nav-button-icon">
          <button onClick={handleCartClick} className="cart-button">
            {cart.length > 0 ? (
              <Badge
                count={cart.length} // Show the number of items in the cart
                offset={[-5, 25]}
                size="small"
                color="#FF6832"
                title="Košík"
              >
                <img src={Cart} alt="Cart Icon" />
              </Badge>
            ) : (
              <img src={Cart} alt="Cart Icon" />
            )}
          </button>
          {/* Hamburger Icon */}
          <IconButton
            aria-label="menu"
            className="hamburger-menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon style={{ color: "black" }} />
          </IconButton>
          {/* Drawer */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            className="nav-drawer"
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <List>
                <ListItemButton component={Link} to="/">
                  <ListItemText primary="Domů" />
                </ListItemButton>
                {!isAuthenticated ? (
                  <ListItemButton component={Link} to="/Nabidka">
                    <ListItemText primary="NABÍDKA" />
                  </ListItemButton>
                ) : (
                  <>
                    <ListItemButton component={Link} to="/Dashboard">
                      <ListItemText primary="DASHBOARD" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Settings">
                      <ListItemText primary="NASTAVENÍ" />
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemText primary="ODHLÁSIT SE" />
                    </ListItemButton>
                  </>
                )}
              </List>
              <Divider />
              <h4>Soc site (Ikony)</h4>
              <h4>Copyright</h4>
              <h4>etc</h4>
            </Box>
          </Drawer>
        </div>
      </div>

      {/* Breadcrumb */}
      {pathSnippets.length > 0 && (
        <div className="breadcrumb-wrap">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      )}
    </nav>
  );
}
