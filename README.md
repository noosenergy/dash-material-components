[![CircleCI](https://circleci.com/gh/noosenergy/dash-material-components.svg?style=svg&circle-token=6388fe0ebfc51208a8aec58b00e40edbb6a60724)](https://circleci.com/gh/noosenergy/dash-material-components)

# Dash Material Design Components

`dash-material-components` allows to build consistently styled dashboards with complex and reactive layouts, following Google's [Material Design](https://material.io/) principles.

The library leverages [MUI React](https://mui.com/) components for use with [Plotly Dash](https://dash.plotly.com/).

This project has been initially boostrapped thanks to the [Dash plugin cookiecutter](https://github.com/plotly/dash-component-boilerplate).

## Quickstart

### Installation

The python package is available from the [PyPi repository](https://pypi.org/project/dash-material-components),

```sh
pip install dash-material-components
```

### Usage as a library

Once installed, start using the Python components exactly like you would use other [Dash component libraries](https://dash.plotly.com/layout),

```python
import dash

import dash_material_components as dmc


# Compose a dashboard layout
text = dmc.Typography(text="Content...", component="p", variant="body2")

section_1 = dmc.Section(
    id="section-1",
    orientation="columns",
    children=[text, text_2],
    cards=[{"title": "Card 1a", "size": 3}, {"title": "Card 1b"}]
)

section_2 = dmc.Section(
    id="section-2",
    size=3,
    children=[text, text_2],
    orientation="rows",
    cards=[{"title": "Card 2a", "size": 4}, {"title": "Card 2b"}]
)

page = dmc.Page(orientation="columns", children=[section_1, section_2])
navbar = dmc.NavBar(title="Custom dash")

layout = dmc.Dashboard(children=[navbar, page])

# Instantiate a Dash app
app = dash.Dash(__name__)
app.layout = layout

if __name__ == "__main__":
    app.run_server()
```

### Usage in notebooks

As pre-requisite, install the Jupyter Lab extension [JupyterDash](https://medium.com/plotly/introducing-jupyterdash-811f1f57c02e),

```shell
~$ pip install jupyter-dash
```

Then, copy the Dash snippet above into a Jupyter notebook cell and replace the `Dash` class with the `JupyterDash` class:

```python
import jupyter_dash

# Instantiate a Dash app
app = jupyter_dash.JupyterDash(__name__)
app.layout = layout

app.run_server(mode='jupyterlab', host="0.0.0.0", port=8001)
```

## Local development

### Structure for a Dash component project

```markdown
* project/
  * python-package/             # The python package, output folder for the bundles.
    * src/                      # The javascript source directory for the components.
      * components/             # Where to put the react component classes.
      * index.js                # The index for the components exported by the bundle.
    * package.json              # JS package build commands.
    * webpack.config.js         # The webpack configs used to generate the bundles.
    * pyproject.toml            # Python package build commands.
```

### Install dependencies

The project is shipped with off-the-shelf scripts to manage node packages as well as a set of utilities for local development. If the `yarn` node package manager is installed globally, install all javascript dependencies,

```shell
~$ yarn install --frozen-lockfile
```

> :warning: the Dash material components has only been tested against Node.js v18.

And thanks to `poetry` python package manager, create a virtual environnement,

```shell
~$ poetry install
```

### Write a new React component

Compose your new Dash components in `src/components` and make sure the React components are exported in your package entrypoint `src/index.js`.

```javascript
import NoosComponent from './components/NoosComponent.jsx';

export {NoosComponent};
```

> :warning: the Dash material components are currently using MUI v.4, with the aim to transitionning to MUI v.5 shortly.

The corresponding Python component API is auto-discovered from the React component declared `Props`, while the component Python docstring are automatically generated from the `Props` React docstrings.

```javascript
/** Used to auto-generate the Python component and docstrings */
const NoosComponent = (props) => {
    const {text} = props;

    return (
        <div>
            <p>{text}</p>
        </div>
    );
}

Box.defaultProps = {
  text: 'Sample value',
};

Box.propTypes = {
  /** Used to auto-generate the Python component and docstrings */
  text: PropTypes.string,
};

export default NoosComponent;
```

> :heavy_exclamation_mark: Be careful to use the correct formatting for your docstrings for them to be properly recognized.

### Create a production build

Once your components have been included into your package entrypoint, run:

* `yarn build:js`, to generate the JavaScript bundle `dash_material_components.js`
* `yarn build:py`, to generate the Python class files for the components.
* `yarn build`, to generate everything: the JavaScript bundles and the Python class files.

In addition to buikld scripts, the project `package.json` offers linter, formatter and hot-reloader:

* `yarn format`, to auto-format the React component code.
* `yarn lint`, to check bundle compliance with ECMA standards.
* `yarn watch`, to watch the library source directory and rebuild the JavaScript bundle.

### Further reading

Included below, few resources on how to extend the Dash component library:

* [basics on React](https://dash.plotly.com/react-for-python-developers)
* [background on Dash components](https://dash.plotly.com/plugins)
* [community-maintained component libraries](https://plotly.com/dash-community-components)
