"""Automatic upload of Dash Material Components."""

import os as _os
import sys as _sys
from importlib import metadata as _metadata

import dash as _dash

from ._imports_ import *  # noqa
from ._imports_ import __all__


__version__ = _metadata.version("dash-material-components")


# Module imports trigger a dash.development import, need to check this first
if not hasattr(_dash, "__plotly_dash") and not hasattr(_dash, "development"):
    print(
        (
            "Dash was not successfully imported.\n"
            "Make sure you don't have a file `dash.py` in your directory."
        ),
        file=_sys.stderr,
    )
    _sys.exit(1)


# Define async resources (dynamic chunks)
async_resources = ["codeeditor", "calendar"]

_js_dist = []

# Add the main bundle
_js_dist.extend(
    [
        {
            "relative_package_path": "dash_material_components.js",
            "namespace": "dash_material_components",
        },
        {
            "relative_package_path": "dash_material_components.js.map",
            "namespace": "dash_material_components",
            "dynamic": True,
        },
    ]
)

# Add async resources
_js_dist.extend(
    [
        {
            "relative_package_path": "async-{}.js".format(async_resource),
            "namespace": "dash_material_components",
            "async": True,
        }
        for async_resource in async_resources
    ]
)

# Add async resource source maps
_js_dist.extend(
    [
        {
            "relative_package_path": "async-{}.js.map".format(async_resource),
            "namespace": "dash_material_components",
            "dynamic": True,
        }
        for async_resource in async_resources
    ]
)

# Add shared chunks if they exist
shared_chunks = ["dash_material_components-shared"]
for shared_chunk in shared_chunks:
    shared_js_path = f"{shared_chunk}.js"
    shared_map_path = f"{shared_chunk}.js.map"

    # Check if files exist before adding them
    if _os.path.exists(_os.path.join(_os.path.dirname(__file__), shared_js_path)):
        _js_dist.extend(
            [
                {
                    "relative_package_path": shared_js_path,
                    "namespace": "dash_material_components",
                },
                {
                    "relative_package_path": shared_map_path,
                    "namespace": "dash_material_components",
                    "dynamic": True,
                },
            ]
        )

# Set the _js_dist for all components
for _component in __all__:
    setattr(locals()[_component], "_js_dist", _js_dist)
