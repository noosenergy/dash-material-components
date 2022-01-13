/* eslint-disable import/prefer-default-export */
// Main component: loading MUI theme
import Dashboard from './components/Dashboard.jsx';

// Layout components: component state managed locally
import NavBar from './components/layout/NavBar.jsx';
import Page from './components/layout/Page.jsx';
import Section from './components/layout/Section.jsx';
import SideBar from './components/layout/SideBar.jsx';
import Tab from './components/layout/Tab.jsx';

// Inputs components: component props managed by Dash renderer
import Dropdown from './components/inputs/Dropdown.jsx';
import Toggle from './components/inputs/Toggle.jsx';

// Display components: component state managed by Dash renderer
import Box from './components/display/Box.jsx';
import Table from './components/display/Table.jsx';
import Typography from './components/display/Typography.jsx';

export {
  // Layout
  Dashboard,
  NavBar,
  Page,
  Section,
  SideBar,
  Tab,
  // Inputs
  Dropdown,
  Toggle,
  // Display
  Box,
  Table,
  Typography,
};
