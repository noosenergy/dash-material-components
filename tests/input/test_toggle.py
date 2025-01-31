from typing import Any, Callable

import pytest
from dash import Dash, Input, Output

import dash_material_components as mdc


TOGGLE_OPTIONS = ["Content...", "Other content..."]


@pytest.fixture
def dash_app() -> Callable[[str | None], Dash]:
    def app_factory(selected: str | None = None) -> Dash:
        kwargs: dict[str, Any] = {"options": TOGGLE_OPTIONS}
        if selected is not None:
            kwargs["selected"] = selected

        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=mdc.Page(
                children=mdc.Section(
                    children=mdc.Box(
                        children=[
                            mdc.Toggle(id="toggle", **kwargs),
                            mdc.Typography(id="text"),
                        ],
                    ),
                    cards=[{"title": "Card"}],
                ),
            )
        )

        @app.callback(
            Output(component_id="text", component_property="text"),
            Input(component_id="toggle", component_property="selected"),
        )
        def on_change(value: str) -> str:
            return value

        return app

    return app_factory


@pytest.mark.parametrize(
    "selected,text",
    [
        (TOGGLE_OPTIONS[0], TOGGLE_OPTIONS[0]),
        (TOGGLE_OPTIONS[1], TOGGLE_OPTIONS[1]),
    ],
)
def test_default_selection(dash_duo, dash_app, selected, text):
    dash_duo.start_server(dash_app(selected))
    dash_duo.wait_for_text_to_equal("#text", text)

    assert dash_duo.get_logs() is None


def test_no_selection(dash_duo, dash_app):
    """Test selected defaults to options[0] if undefined."""
    dash_duo.start_server(dash_app())
    dash_duo.wait_for_text_to_equal("#text", TOGGLE_OPTIONS[0])

    assert dash_duo.get_logs() is None


def test_unique_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    elements = dash_duo.find_element("#toggle").find_elements_by_tag_name("button")

    for i, option in reversed(list(enumerate(TOGGLE_OPTIONS))):
        elements[i].click()
        dash_duo.wait_for_text_to_equal("#text", option)

    assert dash_duo.get_logs() is None
