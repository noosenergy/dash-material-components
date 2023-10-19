import datetime as dt
from typing import Any, Callable, Dict, Optional

import pytest
from dash import Dash, Input, Output

import dash_material_components as mdc


@pytest.fixture
def dash_app() -> Callable[[Optional[str]], Dash]:
    def app_factory(selected: Optional[str] = None) -> Dash:
        kwargs: Dict[str, Any] = {"id": "calendar"}
        if selected is not None:
            kwargs["selected"] = selected

        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=mdc.Page(
                children=mdc.Section(
                    children=mdc.Box(
                        children=[
                            mdc.Calendar(**kwargs),
                            mdc.Typography(id="text"),
                        ],
                    ),
                    cards=[{"title": "Card"}],
                ),
            )
        )

        @app.callback(
            Output(component_id="text", component_property="text"),
            Input(component_id="calendar", component_property="selected"),
        )
        def on_change(value: str) -> str:
            if value:
                return value
            return "No content..."

        return app

    return app_factory


def test_no_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    dash_duo.wait_for_text_to_equal("#text", "No content...")

    assert dash_duo.get_logs() is None


def test_default_selection(dash_duo, dash_app):
    selected = dt.date.today().isoformat()
    dash_duo.start_server(dash_app(selected))
    dash_duo.wait_for_text_to_equal("#text", selected)

    assert dash_duo.get_logs() is None
