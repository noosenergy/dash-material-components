from typing import Callable

import pytest
from dash import Dash, Input, Output, dcc

import dash_mdc_neptune as mdc


@pytest.fixture
def dash_app() -> Callable[[], Dash]:
    def app_factory() -> Dash:
        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=[
                mdc.Page(
                    children=mdc.Section(
                        children=mdc.Box(
                            children=[
                                mdc.Typography(
                                    id="text_id",
                                    component="p",
                                    variant="body2",
                                ),
                                dcc.Input(id="input_text"),
                            ],
                        ),
                        cards=[{"title": "Card"}],
                    ),
                ),
            ]
        )

        @app.callback(
            Output(component_id="text_id", component_property="text"),
            Input(component_id="input_text", component_property="value"),
        )
        def update_text(value: str) -> str:
            return value

        return app

    return app_factory


@pytest.mark.parametrize(
    "input_value,text_value",
    [
        ("Test typography", "Test typography"),
    ],
)
def test_render_alert(dash_duo, dash_app, input_value, text_value):
    dash_duo.start_server(dash_app())

    assert dash_duo.find_element("#text_id").text == ""

    dash_duo.find_element("#input_text").send_keys(input_value)
    dash_duo.wait_for_text_to_equal("#text_id", text_value)

    assert dash_duo.get_logs() is None
