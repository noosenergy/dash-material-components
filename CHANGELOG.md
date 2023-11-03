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
