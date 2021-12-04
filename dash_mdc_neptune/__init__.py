"""Automatic upload of Dash Nepune Material components."""

import sys as _sys
from importlib import metadata as _metadata

import dash as _dash

from ._imports_ import *  # noqa
from ._imports_ import __all__


__version__ = _metadata.version("dash-mdc-neptune")


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
        {"relative_package_path": "dash_mdc_neptune.js", "namespace": "dash_mdc_neptune"},
        {
            "relative_package_path": "dash_mdc_neptune.js.map",
            "namespace": "dash_mdc_neptune",
            "dynamic": True,
        },
    ]
)
for _component in __all__:
    setattr(locals()[_component], "_js_dist", _js_dist)
