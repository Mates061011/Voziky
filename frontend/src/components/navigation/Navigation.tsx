import React from "react";
import { Link, useLocation } from "react-router-dom";
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
import { Breadcrumb } from 'antd';

export default function Navigation() {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  // Add the Home path as the first breadcrumb item
  const breadcrumbItems = [
      <Breadcrumb.Item key="/">
          <Link to="/">Domů</Link>
      </Breadcrumb.Item>,
      ...pathSnippets.map((_, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
          return (
              <Breadcrumb.Item key={url}>
                  <Link to={url}>{pathSnippets[index]}</Link>
              </Breadcrumb.Item>
          );
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
          <Link className="nav-link" to="/">O NÁS</Link>
          <Link className="nav-link" to="/Nabidka">NABÍDKA</Link>
          <Link className="nav-link" to="/Objednat">OBJEDNAT</Link>
        </div>

        {/* Hamburger Icon */}
        <IconButton
          aria-label="menu"
          className="hamburger-menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
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
              <ListItemButton component={Link} to="/Nabidka">
                <ListItemText primary="NABÍDKA" />
              </ListItemButton>
            </List>
            <Divider />
            <h4>Soc site (Ikony)</h4>
            <h4>Copyright</h4>
            <h4>etc</h4>
          </Box>
        </Drawer>
      </div>

      {/* Breadcrumb */}
      {pathSnippets.length > 0 && (
        <div className="breadcrumb-wrap">
          <Breadcrumb>{breadcrumbItems}</Breadcrumb>
        </div>
      )}
    </nav>
  );
}
