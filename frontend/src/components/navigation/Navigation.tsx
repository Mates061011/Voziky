import React from "react";
import { Link, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Logo from "./SiteLogo.svg";
import "./navigation.css";
import { Breadcrumb } from "antd";

export default function Navigation() {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  // Add the Home path as the first breadcrumb item
  const breadcrumbItems = [
    <ListItem key="/" disablePadding>
      <ListItemButton component={Link} to="/">
        <ListItemText primary="Home" />
      </ListItemButton>
    </ListItem>,
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return (
        <ListItem key={url} disablePadding>
          <ListItemButton component={Link} to={url}>
            <ListItemText primary={url.replace("/", "")} />
          </ListItemButton>
        </ListItem>
      );
    }),
  ];

  return (
    <div className="navigation">
      <div className="navigation-wrap">
        <div className="logo-cont">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links-cont">
          <p className="nav-link">O NÁS</p>
          <p className="nav-link">FAQ</p>
          <p className="nav-link">NABÍDKA</p>
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
                <ListItemText primary="O NÁS" />
              </ListItemButton>
              <ListItemButton component={Link} to="/faq">
                <ListItemText primary="FAQ" />
              </ListItemButton>
              <ListItemButton component={Link} to="/nabidka">
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
    </div>
  );
}
