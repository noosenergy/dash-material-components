# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2022-01-17

### Added

- Initial release
- Backbone Material components for a dashboard
- layout components: page, navbar, sidebar, section, tab
- data display components: table, typography
- data inputs components: dropdown, toggle

## [0.1.5] - 2022-01-31

### Changed

- Lock React.js to v16.\* to match Dash renderer version

### Added

- Python functional test suite for MDC components (layout and input)
- Add matplotlib as a package dependency

## [0.1.6] - 2022-02-04

### Changed

- Pin Dash version under release 2.0.0

## [0.1.7] - 2022-05-09

### Changed

- Webpack package export

### Added

- data inputs components: calendar

## [0.1.8] - 2022-05-11

### Added

- layout components: card download
- data inputs components: slider

## [0.1.9] - 2022-05-30

### Changed

- Pin Werkzeug version under release 2.1.0

## [0.2.0] - 2023-09-08

### Changed

- Pin Werkzeug version to 2.0.1
- Pin Selenium version under 4.2.0
- Delete matplotlib.py and matplotlib dependency

## [0.3.0] - 2023-09-19

### Changed

- Bump python to v3.11.4
- Pin Dash version over 2.0 and under 2.10
- Remove Selenium and Werkzeug pin

## [0.4.0] - 2023-10-16

### Changed

- Add components InputText and Autocomplete
- Update date picker to allow faster year change
- Migrage to functional based components
- Use node v18
- Improve tests

## [1.0.0] - 2023-10-17

### Changed

- Rename package from dash-mdc-neptune to dash-material-components

## [1.1.0] - 2023-10-25

### Changed

- Change Slider interface:
  - Allow float/input type in the optional InputText
  - Allow adornments
  - Delete showInputText prop
  - Add precision prop
- Fix Slider and InputText spacing/style

## [1.1.1] - 2023-10-30

### Changed

- Add margin prop to all input components
- Improve the sizing of the slider input
- Fix calendar width scaling

## [1.1.2] - 2023-11-03

### Changed

- Add setProps prop to alert component

## [1.1.3] - 2023-11-07

### Changed

- Add Button component
- Fix freeSolo in Autocomplete component

## [1.1.4] - 2023-11-07

### Changed

- Fix freeSolo in Autocomplete component

## [1.1.5] - 2023-11-09

### Added

- layout component: error

### Changed

- Show error page in page component

## [1.1.6] - 2023-12-04

### Changed

- Keep popup open after selecting an option in Autocomplete component if multiple is true

## [1.1.7] - 2023-12-12

### Changed

- Add disabled parameter to all input components, allowing to have them rendered but not interactable

## [1.1.8] - 2023-12-22

### Changed

- Keep Slider label always visible when inputText is disabled

## [1.2.0] - 2024-01-23

### Changed

- Upgrade react to react@^18.2.0
- Migrate material-ui from v4 to v5 (@mui)
- Install dependencies using yarn.lock file
- Add .nvmrc file for local development

## [2.0.0] - 2024-01-30

### Changed

- Migrate project to typescript
- Migrate to emotion styling

## [2.0.1] - 2024-02-26

### Changed

- Prefix emotion generated css classes
- Upgrade dependencies

## [2.0.2] - 2024-03-26

### Changed

- Fix calendar compoment problem causing previous day to be selected

## [2.0.3] - 2024-04-16

### Changed

- Add debounce and debouceSeconds props to InputText to delay dash callback

## [2.0.4] - 2024-06-06

### Changed

- Make Card component horizontally scrollable
- Fix Tabs & Graph alignment

## [2.0.5] - 2024-09-18

### Changed

- Add debounce to autocomplete input, new prop debounceSeconds

## [2.0.6] - 2024-09-20

### Changed

- Add IconButton component wrapping MUI IconButton

## [2.0.7] - 2024-09-30

### Changed

- Display table and tab content in full height
- Add custom sx styling to the table with the prop tableStyle

## [2.0.8] - 2024-10-02

### Changed

- Suport more Dash versions, from 2.0 to <3.0

## [2.0.9] - 2024-11-22

### Changed

- Refresh InputText on value prop change making it usable as an output
