"""Automatic upload of Dash Material Components."""

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


_js_dist = []
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
for _component in __all__:
    setattr(locals()[_component], "_js_dist", _js_dist)
