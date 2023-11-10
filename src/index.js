// Main component: loading MUI theme
import Dashboard from './components/Dashboard';

// Layout components: component state managed locally
import Error from './components/layout/Error';
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
import InputText from './components/inputs/InputText';
import Autocomplete from './components/inputs/Autocomplete';
import Button from './components/inputs/Button';

// Display components: component state managed by Dash renderer
import Alert from './components/display/Alert';
import Box from './components/display/Box';
import Table from './components/display/Table';
import Typography from './components/display/Typography';

export {
  // Layout
  Dashboard,
  Error,
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
  InputText,
  Autocomplete,
  Button,
  // Display
  Alert,
  Box,
  Table,
  Typography
};
