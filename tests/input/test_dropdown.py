from typing import Any, Callable, Dict, List

import pytest
from dash import Dash, Input, Output

import dash_material_components as mdc


DROPDOWN_OPTIONS = ["Content...", "Other content..."]


@pytest.fixture
def dash_app() -> Callable[[List[str]], Dash]:
    def app_factory(selected: List[str] = []) -> Dash:
        kwargs: Dict[str, Any] = {"options": DROPDOWN_OPTIONS}
        if selected is not None:
            kwargs["selected"] = selected

        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=mdc.Page(
                children=mdc.Section(
                    children=mdc.Box(
                        children=[
                            mdc.Dropdown(id="dropdown", **kwargs),
                            mdc.Typography(id="text"),
                        ],
                    ),
                    cards=[{"title": "Card"}],
                ),
            )
        )

        @app.callback(
            Output(component_id="text", component_property="text"),
            Input(component_id="dropdown", component_property="selected"),
        )
        def on_change(values: List[str]) -> str:
            if values:
                return ", ".join(values)
            return "No content..."

        return app

    return app_factory


def test_no_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    dash_duo.wait_for_text_to_equal("#text", "No content...")

    assert dash_duo.get_logs() is None


@pytest.mark.parametrize(
    "selected,text",
    [
        ([DROPDOWN_OPTIONS[0]], DROPDOWN_OPTIONS[0]),
        (DROPDOWN_OPTIONS, ", ".join(DROPDOWN_OPTIONS)),
    ],
)
def test_default_selection(dash_duo, dash_app, selected, text):
    dash_duo.start_server(dash_app(selected))
    dash_duo.wait_for_text_to_equal("#text", text)

    assert dash_duo.get_logs() is None


def test_single_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    dash_duo.find_element("#dropdown-select").click()
    elements = dash_duo.find_element("#menu-").find_elements_by_tag_name("li")

    for i, option in enumerate(DROPDOWN_OPTIONS):
        # Select the option
        elements[i].click()
        # Test that the text is updated
        dash_duo.wait_for_text_to_equal("#text", option)
        # Unselect the option
        elements[i].click()

    assert dash_duo.get_logs() is None


def test_multiple_selections(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    dash_duo.find_element("#dropdown-select").click()
    elements = dash_duo.find_element("#menu-").find_elements_by_tag_name("li")

    # Select all options
    for i, _ in enumerate(DROPDOWN_OPTIONS):
        elements[i].click()
    # Test that the text is updated
    dash_duo.wait_for_text_to_equal("#text", ", ".join(DROPDOWN_OPTIONS))

    assert dash_duo.get_logs() is None
