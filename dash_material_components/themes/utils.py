import base64
import pathlib


STATIC_DIR = pathlib.Path(__file__).parent / "static"


def _get_img_uri(img_file: str) -> str:
    img_path = STATIC_DIR / img_file
    with img_path.open(mode="rb") as f:
        img_data = f.read()
    encoded = base64.b64encode(img_data).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def _to_colourscale(colour_sequence: list[str]) -> list[tuple[float, str]]:
    length = len(colour_sequence)
    return [(i / (length - 1), colour) for i, colour in enumerate(colour_sequence)]
