from typing import Callable, Optional

import pytest
from dash import Dash, Input, Output, State, dcc, html

import dash_material_components as mdc


@pytest.fixture
def dash_app() -> Callable[[str], Dash]:
    def app_factory(text_value: Optional[str] = None) -> Dash:
        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=[
                mdc.Page(
                    children=mdc.Section(
                        children=mdc.Box(
                            children=[
                                dcc.Input(id="input_text", value=text_value),
                                html.Button("Submit", id="button", n_clicks=0),
                            ],
                        ),
                        cards=[{"title": "Card"}],
                    ),
                ),
                mdc.Alert(id="alert"),
            ]
        )

        @app.callback(
            Output(component_id="alert", component_property="message"),
            Input(component_id="button", component_property="n_clicks"),
            State(component_id="input_text", component_property="value"),
        )
        def update_alert(n_clicks: int, value: str) -> str:
            return value

        return app

    return app_factory


test_data = [
    ("Test alert", "Test alert"),
]


@pytest.mark.parametrize("text_value,alert_value", test_data)
def test_render_alert(dash_duo, dash_app, text_value, alert_value):
    dash_duo.start_server(dash_app(""))

    assert dash_duo.find_element("#alert").text == ""

    dash_duo.find_element("#input_text").send_keys(text_value)
    dash_duo.find_element("#button").click()
    dash_duo.wait_for_text_to_equal("#alert", alert_value)

    assert dash_duo.get_logs() is None


@pytest.mark.parametrize("text_value,alert_value", test_data)
def test_render_alert_same_message(dash_duo, dash_app, text_value, alert_value):
    dash_duo.start_server(dash_app(""))
    dash_duo.find_element("#input_text").send_keys(text_value)
    dash_duo.find_element("#button").click()
    dash_duo.find_element("#input_text").click()
    dash_duo.wait_for_text_to_equal("#alert", "")

    dash_duo.find_element("#button").click()
    dash_duo.wait_for_text_to_equal("#alert", alert_value)

    assert dash_duo.get_logs() is None
