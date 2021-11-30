# dash-mdc-neptune

dash-mdc-neptune is a Dash component library.

Get started with:
1. Install Dash and its dependencies: https://dash.plotly.com/installation
2. Run `python usage.py`
3. Visit http://localhost:8050 in your web browser

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

### Install dependencies

If you have selected install_dependencies during the prompt, you can skip this part.

1. Install npm packages
    ```
    $ npm install
    ```
2. Create a virtual env and activate.
    ```
    $ virtualenv venv
    $ . venv/bin/activate
    ```
    _Note: venv\Scripts\activate for windows_

3. Install python packages required to build components.
    ```
    $ pip install -r requirements.txt
    ```
4. Install the python packages for testing (optional)
    ```
    $ pip install -r tests/requirements.txt
    ```

### Write your component code in `src/lib/components/DashMdcNeptune.react.js`.

- The demo app is in `src/demo` and you will import your example component code into your demo app.
- Test your code in a Python environment:
    1. Build your code
        ```
        $ npm run build
        ```
    2. Run and modify the `usage.py` sample dash app:
        ```
        $ python usage.py
        ```
- Write tests for your component.
    - A sample test is available in `tests/test_usage.py`, it will load `usage.py` and you can then automate interactions with selenium.
    - Run the tests with `$ pytest tests`.
    - The Dash team uses these types of integration tests extensively. Browse the Dash component code on GitHub for more examples of testing (e.g. https://github.com/plotly/dash-core-components)
- Add custom styles to your component by putting your custom CSS files into your distribution folder (`dash_mdc_neptune`).
    - Make sure that they are referenced in `MANIFEST.in` so that they get properly included when you're ready to publish your component.
    - Make sure the stylesheets are added to the `_css_dist` dict in `dash_mdc_neptune/__init__.py` so dash will serve them automatically when the component suite is requested.
- [Review your code](./review_checklist.md)

### Create a production build and publish:

1. Build your code:
    ```
    $ npm run build
    ```
2. Create a Python distribution
    ```
    $ python setup.py sdist bdist_wheel
    ```
    This will create source and wheel distribution in the generated the `dist/` folder.
    See [PyPA](https://packaging.python.org/guides/distributing-packages-using-setuptools/#packaging-your-project)
    for more information.

3. Test your tarball by copying it into a new environment and installing it locally:
    ```
    $ pip install dash_mdc_neptune-0.0.1.tar.gz
    ```

4. If it works, then you can publish the component to NPM and PyPI:
    1. Publish on PyPI
        ```
        $ twine upload dist/*
        ```
    2. Cleanup the dist folder (optional)
        ```
        $ rm -rf dist
        ```
    3. Publish on NPM (Optional if chosen False in `publish_on_npm`)
        ```
        $ npm publish
        ```
        _Publishing your component to NPM will make the JavaScript bundles available on the unpkg CDN. By default, Dash serves the component library's CSS and JS locally, but if you choose to publish the package to NPM you can set `serve_locally` to `False` and you may see faster load times._

5. Share your component with the community! https://community.plotly.com/c/dash
    1. Publish this repository to GitHub
    2. Tag your GitHub repository with the plotly-dash tag so that it appears here: https://github.com/topics/plotly-dash
    3. Create a post in the Dash community forum: https://community.plotly.com/c/dash

#
# Code Review Checklist

## Code quality & design

-   Is your code clear? If you had to go back to it in a month, would you be happy to? If someone else had to contribute to it, would they be able to?

    A few suggestions:

    -   Make your variable names descriptive and use the same naming conventions throughout the code.

    -   For more complex pieces of logic, consider putting a comment, and maybe an example.

    -   In the comments, focus on describing _why_ the code does what it does, rather than describing _what_ it does. The reader can most likely read the code, but not necessarily understand why it was necessary.

    -   Don't overdo it in the comments. The code should be clear enough to speak for itself. Stale comments that no longer reflect the intent of the code can hurt code comprehension.

*   Don't repeat yourself. Any time you see that the same piece of logic can be applied in multiple places, factor it out into a function, or variable, and reuse that code.
*   Scan your code for expensive operations (large computations, DOM queries, React re-renders). Have you done your possible to limit their impact? If not, it is going to slow your app down.
*   Can you think of cases where your current code will break? How are you handling errors? Should the user see them as notifications? Should your app try to auto-correct them for them?

## Component API

-   Have you tested your component on the Python side by creating an app in `usage.py` ?

    Do all of your component's props work when set from the back-end?

    Should all of them be settable from the back-end or are some only relevant to user interactions in the front-end?

-   Have you provided some basic documentation about your component? The Dash community uses [react docstrings](https://github.com/plotly/dash-docs/blob/master/tutorial/plugins.py#L45) to provide basic information about dash components. Take a look at this [Checklist component example](https://github.com/plotly/dash-core-components/blob/master/src/components/Checklist.react.js) and others from the dash-core-components repository.

    At a minimum, you should describe what your component does, and describe its props and the features they enable.

    Be careful to use the correct formatting for your docstrings for them to be properly recognized.

## Tests

-   The Dash team uses integration tests extensively, and we highly encourage you to write tests for the main functionality of your component. In the `tests` folder of the boilerplate, you can see a sample integration test. By launching it, you will run a sample Dash app in a browser. You can run the test with:
    ```
    python -m tests.test_render
    ```
    [Browse the Dash component code on GitHub for more examples of testing.](https://github.com/plotly/dash-core-components)

## Ready to publish? Final scan

-   Take a last look at the external resources that your component is using. Are all the external resources used [referenced in `MANIFEST.in`](https://github.com/plotly/dash-docs/blob/0b2fd8f892db720a7f3dc1c404b4cff464b5f8d4/tutorial/plugins.py#L55)?

-   [You're ready to publish!](https://github.com/plotly/dash-component-boilerplate/blob/master/%7B%7Bcookiecutter.project_shortname%7D%7D/README.md#create-a-production-build-and-publish)
