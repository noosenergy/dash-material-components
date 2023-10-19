from typing import Callable

import pytest
from dash import Dash, Input, Output
from dash.testing.composite import DashComposite

import dash_material_components as mdc


@pytest.fixture(scope="module")
def dash_app() -> Callable[[str, str, int, int, int], Dash]:
    def app_factory(
        value: str = "",
        type: str = "text",
        min_value: int = 0,
        max_value: int = 100,
        max_length: int = 10,
    ) -> Dash:
        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=mdc.Page(
                children=mdc.Section(
                    children=mdc.Box(
                        children=[
                            mdc.InputText(
                                id="input-text",
                                inputType=type,
                                minValue=min_value,
                                maxValue=max_value,
                                maxLength=max_length,
                                value=value,
                            ),
                            mdc.Typography(id="text", text="Content..."),
                        ],
                    ),
                    cards=[{"title": "Card"}],
                ),
            )
        )

        @app.callback(
            Output(component_id="text", component_property="text"),
            Input(component_id="input-text", component_property="value"),
        )
        def update_output(value):
            return value

        return app

    return app_factory


def test_no_input(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    dash_duo.wait_for_text_to_equal("#text", "")
    assert dash_duo.get_logs() is None


def test_initial_input(dash_duo, dash_app):
    dash_duo.start_server(dash_app(value="test"))
    dash_duo.wait_for_text_to_equal("#text", "test")
    assert dash_duo.get_logs() is None


def test_typing(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    dash_duo.find_element("input").send_keys("test")
    dash_duo.wait_for_text_to_equal("#text", "test")
    assert dash_duo.get_logs() is None


def test_typing_integer_beyond_range(dash_duo: DashComposite, dash_app):
    dash_duo.start_server(dash_app(type="integer", min_value=0, max_value=100, value=0))
    input_text = dash_duo.find_element("input")
    # set to 100
    input_text.clear()
    input_text.send_keys("100")
    dash_duo.wait_for_text_to_equal("#text", "100")
    # setting to 1000000 should be ignored
    input_text.send_keys("1000000")
    dash_duo.wait_for_text_to_equal("#text", "100")
    # set to 1
    input_text.clear()
    input_text.send_keys("1")
    dash_duo.wait_for_text_to_equal("#text", "1")
    # Setting to -1 should be ignored
    input_text.clear()
    input_text.send_keys("-1")
    dash_duo.wait_for_text_to_equal("#text", "1")

    assert dash_duo.get_logs() is None


def test_typing_beyond_max_length(dash_duo: DashComposite, dash_app):
    dash_duo.start_server(dash_app(max_length=10))
    input_text = dash_duo.find_element("input")
    # set to 10 characters
    input_text.send_keys("1234567890")
    dash_duo.wait_for_text_to_equal("#text", "1234567890")
    # setting to 11 characters should be ignored
    input_text.send_keys("1")
    dash_duo.wait_for_text_to_equal("#text", "1234567890")

    assert dash_duo.get_logs() is None
