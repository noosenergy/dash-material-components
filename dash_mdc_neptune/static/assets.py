import base64
import pathlib


__all__ = ["NOOS_ENERGY_LOGO"]


def _get_uri(source: str):
    file_path = pathlib.Path(__file__).parent / source
    image_data = file_path.open("rb").read()
    encoded = base64.b64encode(image_data).decode("ascii")
    return f"data:image/png;base64,{encoded}"


NOOS_ENERGY_LOGO = _get_uri("logo.png")
