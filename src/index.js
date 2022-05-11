// Main component: loading MUI theme
import Dashboard from './components/Dashboard';

// Layout components: component state managed locally
import NavBar from './components/layout/NavBar';
import Page from './components/layout/Page';
import Section from './components/layout/Section';
import SideBar from './components/layout/SideBar';
import Tab from './components/layout/Tab';

// Inputs components: component props managed by Dash renderer
import Calendar from './components/inputs/Calendar';
import Dropdown from './components/inputs/Dropdown';
import Slider from './components/inputs/Slider';
import Toggle from './components/inputs/Toggle';

// Display components: component state managed by Dash renderer
import Box from './components/display/Box';
import Table from './components/display/Table';
import Typography from './components/display/Typography';

export {
  // Layout
  Dashboard,
  NavBar,
  Page,
  Section,
  SideBar,
  Tab,
  // Inputs
  Calendar,
  Dropdown,
  Slider,
  Toggle,
  // Display
  Box,
  Table,
  Typography
};
