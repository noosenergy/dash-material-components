import pytest
from dash import Dash
from dash.dependencies import Input, Output

import dash_mdc_neptune as mdc


DROPDOWN_OPTIONS = {
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
                        mdc.Dropdown(
                            id="dropdown",
                            options=list(DROPDOWN_OPTIONS.keys()),
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
        Input(component_id="dropdown", component_property="selected"),
    )
    def update_dropdown(values):
        if not values:
            return None
        return "".join(DROPDOWN_OPTIONS[i] for i in values)

    return app


def test_no_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app)
    dash_duo.wait_for_text_to_equal("#text", "")

    assert dash_duo.get_logs() is None


def test_single_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app)
    dash_duo.find_element("#dropdown-select").click()
    elements = dash_duo.find_element("#menu-").find_elements_by_tag_name("li")

    for i in DROPDOWN_OPTIONS.keys():
        # Select the option
        elements[i].click()
        # Test that the text is updated
        dash_duo.wait_for_text_to_equal("#text", DROPDOWN_OPTIONS[i])
        # Unselect the option
        elements[i].click()

    assert dash_duo.get_logs() is None


def test_multiple_selections(dash_duo, dash_app):
    dash_duo.start_server(dash_app)
    dash_duo.find_element("#dropdown-select").click()
    elements = dash_duo.find_element("#menu-").find_elements_by_tag_name("li")

    # Select all options
    for i in DROPDOWN_OPTIONS.keys():
        elements[i].click()
    # Test that the text is updated
    dash_duo.wait_for_text_to_equal("#text", "".join(value for value in DROPDOWN_OPTIONS.values()))

    assert dash_duo.get_logs() is None
