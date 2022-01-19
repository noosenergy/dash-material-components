import pytest
from dash import Dash
from dash.dependencies import Input, Output

import dash_mdc_neptune as mdc


TOGGLE_OPTIONS = {
    0: "Content...",
    1: "Other content...",
}


@pytest.fixture
def dash_app():
    app = Dash(name=__name__)
    app.layout = mdc.Dashboard(
        children=mdc.Page(
            children=mdc.Section(
                children=mdc.Box(
                    children=[
                        mdc.Toggle(
                            id="toggle",
                            options=list(TOGGLE_OPTIONS.keys()),
                            selected=1,
                        ),
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
    def update_toggle(value):
        return TOGGLE_OPTIONS[value]

    return app


def test_default_selected_toggle(dash_duo, dash_app):
    dash_duo.start_server(dash_app)
    dash_duo.wait_for_text_to_equal("#text", TOGGLE_OPTIONS[1])

    assert dash_duo.get_logs() is None


def test_select_toggles(dash_duo, dash_app):
    dash_duo.start_server(dash_app)
    elements = dash_duo.find_element("#toggle").find_elements_by_tag_name("button")

    for i in TOGGLE_OPTIONS.keys():
        elements[i].click()
        dash_duo.wait_for_text_to_equal("#text", TOGGLE_OPTIONS[i])

    assert dash_duo.get_logs() is None
