import random
from typing import Any, Callable, Dict, Optional

import pytest
from dash import Dash, Input, Output
from dash.testing.composite import DashComposite
from selenium.webdriver.common.action_chains import ActionChains

import dash_material_components as mdc


SLIDER_OPTIONS = {"minValue": 0, "maxValue": 100, "stepValue": 1, "selected": 50, "width": 100}


@pytest.fixture
def dash_app() -> Callable[[Optional[int]], Dash]:
    def app_factory(selected: Optional[int] = None) -> Dash:
        kwargs: Dict[str, Any] = SLIDER_OPTIONS
        if selected is not None:
            kwargs["selected"] = selected

        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=mdc.Page(
                children=mdc.Section(
                    children=mdc.Box(
                        children=[
                            mdc.Slider(id="slider", **kwargs),
                            mdc.Typography(id="text"),
                        ],
                    ),
                    cards=[{"title": "Card"}],
                ),
            )
        )

        @app.callback(
            Output(component_id="text", component_property="text"),
            Input(component_id="slider", component_property="selected"),
        )
        def on_change(selected: int) -> str:
            return str(selected)

        return app

    return app_factory


@pytest.mark.parametrize(
    "selected,text",
    [
        (0, "0"),
        (50, "50"),
        (100, "100"),
    ],
)
def test_props(dash_duo: DashComposite, dash_app, selected, text):
    dash_duo.start_server(dash_app(selected))
    dash_duo.wait_for_text_to_equal("#text", text)

    assert dash_duo.find_element("#text").text == text
    assert dash_duo.get_logs() is None


def test_slide_action(dash_duo: DashComposite, dash_app):
    initial_value = 50
    dash_duo.start_server(dash_app(initial_value))
    slider = dash_duo.find_element(".MuiSlider-thumb")

    # move slider
    slide_amount = random.randint(-50, 50)
    ActionChains(dash_duo.driver).drag_and_drop_by_offset(slider, slide_amount, 0).perform()
    assert dash_duo.find_element("#text").text == str(initial_value + slide_amount)

    assert dash_duo.get_logs() is None
