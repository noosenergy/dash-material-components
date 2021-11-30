import json
import pathlib as _path
import sys as _sys
import dash as _dash

from ._imports_ import *  # noqa
from ._imports_ import __all__


# Module imports trigger a dash.development import, need to check this first
if not hasattr(_dash, "__plotly_dash") and not hasattr(_dash, "development"):
    print(
        (
            "Dash was not successfully imported.\n"
            "Make sure you don't have a file named `dash.py` in your current directory."
        ),
        file=_sys.stderr,
    )
    _sys.exit(1)

_basepath = _path.Path(__file__).parent
_filepath = _basepath / "package-info.json"
with _filepath.open(mode="rt") as f:
    package = json.load(f)

package_name = package["name"].replace(" ", "_").replace("-", "_")
__version__ = package["version"]


_js_dist = []
_js_dist.extend(
    [
        {"relative_package_path": "dash_mdc_neptune.min.js", "namespace": package_name},
        {
            "relative_package_path": "dash_mdc_neptune.min.js.map",
            "namespace": package_name,
            "dynamic": True,
        },
    ]
)


for _component in __all__:
    setattr(locals()[_component], "_js_dist", _js_dist)
