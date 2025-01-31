import random
from typing import Any, Callable

import pytest
from dash import Dash, Input, Output
from dash.testing.composite import DashComposite
from selenium.webdriver.common.action_chains import ActionChains

import dash_material_components as mdc


SLIDER_OPTIONS = {"minValue": 0, "maxValue": 100, "stepValue": 1, "selected": 50, "width": 100}


@pytest.fixture
def dash_app() -> Callable[[int | None, str | None], Dash]:
    def app_factory(selected: int | None = None, input_type: str | None = None) -> Dash:
        kwargs: dict[str, Any] = SLIDER_OPTIONS
        if selected is not None:
            kwargs["selected"] = selected
        kwargs["inputType"] = input_type

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
        def on_change(selected: int | float) -> str:
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


def test_slider_render_float_input_text(dash_duo: DashComposite, dash_app):
    dash_duo.start_server(dash_app(input_type="float", selected=43.21))
    input_field = dash_duo.find_element(".MuiInputBase-input")
    assert input_field.get_attribute("value") == "43.21"
    assert dash_duo.get_logs() is None


def test_slider_render_integer_input_text(dash_duo: DashComposite, dash_app):
    dash_duo.start_server(dash_app(input_type="integer", selected=12))
    input_field = dash_duo.find_element(".MuiInputBase-input")
    assert input_field.get_attribute("value") == "12"
    assert dash_duo.get_logs() is None


def test_slider_update_from_input_text(dash_duo: DashComposite, dash_app):
    dash_duo.start_server(dash_app(input_type="float", selected=12.34))
    input_field = dash_duo.find_element(".MuiInputBase-input")

    # test if input text is reflected in output typography
    input_field.clear()
    input_field.send_keys("56.78")
    assert dash_duo.find_element("#text").text == "56.78"

    assert dash_duo.get_logs() is None


def test_slider_input_validation(dash_duo: DashComposite, dash_app):
    dash_duo.start_server(dash_app(input_type="float", selected=12.34))
    input_field = dash_duo.find_element(".MuiInputBase-input")

    # test if default precision (2) is respected
    input_field.clear()
    input_field.send_keys("12.345678")
    assert dash_duo.find_element("#text").text == "12.34"

    # test if invalid characters are ignored
    input_field.clear()
    input_field.send_keys("-")
    input_field.send_keys(".")
    assert dash_duo.find_element("#text").text == "12.34"
    input_field.clear()
    input_field.send_keys("0")
    input_field.send_keys(".")
    input_field.send_keys("abcd")
    assert dash_duo.find_element("#text").text == "0"
    input_field.clear()
    input_field.send_keys("--")
    assert dash_duo.find_element("#text").text == "0"

    assert dash_duo.get_logs() is None
