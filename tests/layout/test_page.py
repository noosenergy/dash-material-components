from typing import Callable

import pytest
from dash import Dash, Input, Output, html
from dash.testing.composite import DashComposite

import dash_material_components as mdc


@pytest.fixture
def dash_app() -> Callable[[str], Dash]:
    def app_factory(
        text: str | None = None,
        component: str | None = None,
        status: int | None = None,
        message: str | None = None,
    ) -> Dash:
        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=[
                mdc.Page(
                    id="page",
                    children=mdc.Section(
                        children=mdc.Box(
                            children=[
                                mdc.Typography(text=text, component=component, variant="body2"),
                                html.Button("Submit", id="button", n_clicks=0),
                            ],
                        ),
                        cards=[{"title": "Card"}],
                    ),
                ),
            ]
        )

        @app.callback(
            Output(component_id="page", component_property="errorStatus"),
            Output(component_id="page", component_property="errorMessage"),
            Input(component_id="button", component_property="n_clicks"),
            prevent_initial_call=True,
        )
        def show_error_page(n_clicks):
            print("inside", status, message)
            return [status, message]

        return app

    return app_factory


def test_render_page(dash_duo: DashComposite, dash_app):
    text = "Content..."
    component = "p"
    dash_duo.start_server(dash_app(text, component))
    element = (
        dash_duo.find_element("#page").find_element_by_id("section").find_element_by_id("text")
    )

    assert element.find_element_by_tag_name(component).text == text
    assert dash_duo.get_logs() is None


def test_render_error_page(dash_duo: DashComposite, dash_app):
    status, message = 404, "Page not found"

    dash_duo.start_server(dash_app(None, None, status, message))
    dash_duo.find_element("#button").click()

    assert str(status) in dash_duo.driver.page_source
    assert message in dash_duo.driver.page_source
    assert dash_duo.get_logs() is None
