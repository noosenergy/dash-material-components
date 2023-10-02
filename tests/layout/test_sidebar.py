import pytest
from dash import Dash, Input, Output
from dash.testing.composite import DashComposite
from selenium.common.exceptions import NoSuchElementException

import dash_mdc_neptune as mdc


TOGGLE_OPTIONS = ["test a", "test b"]


@pytest.fixture
def dash_app():
    app = Dash(name=__name__)
    app.layout = mdc.Dashboard(
        children=[
            mdc.Page(
                children=mdc.Section(
                    children=mdc.Typography(id="text"),
                    cards=[{"title": "Card"}],
                )
            ),
            mdc.SideBar(
                children=mdc.Toggle(
                    id="toggle",
                    orientation="vertical",
                    options=TOGGLE_OPTIONS,
                    selected=TOGGLE_OPTIONS[1],
                ),
                title="Settings",
                settings=["Select choice"],
            ),
        ]
    )

    @app.callback(
        Output(component_id="text", component_property="text"),
        Input(component_id="toggle", component_property="selected"),
    )
    def on_change(value: str) -> str:
        return value

    return app


def test_open_close(dash_duo: DashComposite, dash_app):
    dash_duo.start_server(dash_app)

    # is closed
    with pytest.raises(NoSuchElementException):
        dash_duo.find_element("#close-sidebar-chevron")

    # open
    dash_duo.find_element("#sidebar-toggle").click()
    dash_duo.wait_for_element("#close-sidebar-chevron")

    # close
    dash_duo.find_element("#close-sidebar-chevron").click()
    with pytest.raises(NoSuchElementException):
        dash_duo.find_element("#close-sidebar-chevron")

    assert dash_duo.get_logs() is None


def test_callbacks(dash_duo, dash_app):
    dash_duo.start_server(dash_app)
    dash_duo.find_element("#sidebar-toggle").click()

    elements = dash_duo.find_element("#toggle").find_elements_by_tag_name("button")

    for i, option in reversed(list(enumerate(TOGGLE_OPTIONS))):
        elements[i].click()
        dash_duo.wait_for_text_to_equal("#text", option)

    assert dash_duo.get_logs() is None
