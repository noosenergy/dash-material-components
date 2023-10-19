import pytest
from dash import Dash

import dash_material_components as mdc


TEXT_OPTIONS = ["Content...", "Other content..."]


@pytest.fixture
def dash_app():
    app = Dash(name=__name__)
    app.layout = mdc.Dashboard(
        children=mdc.Page(
            children=mdc.Section(
                children=mdc.Tab(
                    children=[
                        mdc.Typography(text=TEXT_OPTIONS[0]),
                        mdc.Typography(text=TEXT_OPTIONS[1]),
                    ],
                    tabs=[{"label": "2a"}, {"label": "2b"}],
                ),
                cards=[{"title": "Card"}],
            ),
        )
    )
    return app


def test_default_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app)
    dash_duo.wait_for_text_to_equal("#text", TEXT_OPTIONS[0])

    assert dash_duo.get_logs() is None


def test_unique_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app)
    elements = dash_duo.find_element("#tab").find_elements_by_tag_name("button")

    for i, option in reversed(list(enumerate(TEXT_OPTIONS))):
        elements[i].click()
        dash_duo.wait_for_text_to_equal("#text", option)

    assert dash_duo.get_logs() is None
