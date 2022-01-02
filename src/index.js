/* eslint-disable import/prefer-default-export */
// Main component: loading MUI theme
import Dashboard from './components/Dashboard.jsx';

// Layout components: state component managed locally
import NavBar from './components/layout/NavBar.jsx';
import Page from './components/layout/Page.jsx';
import Section from './components/layout/Section.jsx';
import SideBar from './components/layout/SideBar.jsx';
import Tab from './components/layout/Tab.jsx';

// Display components: state component managed by Dash renderer
import Box from './components/display/Box.jsx';
import Divider from './components/display/Divider.jsx';
import Dropdown from './components/display/Dropdown.jsx';
import Table from './components/display/Table.jsx';
import Toggle from './components/display/Toggle.jsx';
import Typography from './components/display/Typography.jsx';

export {
  Dashboard,
  NavBar,
  Page,
  Section,
  SideBar,
  Tab,
  Box,
  Divider,
  Dropdown,
  Table,
  Toggle,
  Typography,
};
