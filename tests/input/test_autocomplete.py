import random
from typing import Callable, List

import pytest
from dash import Dash, Input, Output

import dash_mdc_neptune as mdc


options = [
    {"label": "option_a", "value": "value_a"},
    {"label": "option_b", "value": "value_b"},
    {"label": "option_c", "value": "value_c"},
]


@pytest.fixture(scope="module")
def dash_app() -> Callable[[List[dict], bool], Dash]:
    def app_factory(selected: List[dict] = [], multiple: bool = False) -> Dash:
        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=mdc.Page(
                children=mdc.Section(
                    children=mdc.Box(
                        children=[
                            mdc.Autocomplete(
                                id="autocomplete",
                                options=options,
                                labelText="Select an option",
                                selected=selected,
                                multiple=multiple,
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
            Input(component_id="autocomplete", component_property="selected"),
        )
        def update_output(value):
            labels = [option["label"] for option in value]
            if value:
                return f"You have selected: {', '.join(labels)}"
            else:
                return "Please select an option"

        return app

    return app_factory


def test_no_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    dash_duo.wait_for_text_to_equal("#text", "Please select an option")
    assert dash_duo.get_logs() is None


@pytest.mark.parametrize("selected", [[options[0]], [options[1], options[2]]])
def test_initial_selection(dash_duo, dash_app, selected):
    dash_duo.start_server(dash_app(selected, multiple=True))
    selected_labels = [option["label"] for option in selected]
    dash_duo.wait_for_text_to_equal("#text", f"You have selected: {', '.join(selected_labels)}")
    assert dash_duo.get_logs() is None


@pytest.mark.parametrize("index", [i for i in range(len(options))])
def test_single_selection(dash_duo, dash_app, index):
    dash_duo.start_server(dash_app())
    dash_duo.find_element("#autocomplete").click()

    elements = dash_duo.find_element("#autocomplete-popup").find_elements_by_tag_name("li")

    # Select the option
    elements[index].click()
    # Test that the text is updated
    dash_duo.wait_for_text_to_equal("#text", f'You have selected: {options[index]["label"]}')

    assert dash_duo.get_logs() is None


def test_multiple_selection(dash_duo, dash_app):
    # Pick 2 random options to select
    rand_idxs = random.sample(range(len(options)), 2)

    dash_duo.start_server(dash_app(multiple=True))
    open_btn = dash_duo.find_element("button[title=Open]")

    # select the options
    for index in rand_idxs:
        # Open popup
        open_btn.click()
        # Get list of options
        elements = dash_duo.find_element("#autocomplete-popup").find_elements_by_tag_name("li")
        # Click on the option
        elements[index].click()

    dash_duo.wait_for_text_to_equal(
        "#text",
        f'You have selected: {options[rand_idxs[0]]["label"]}, {options[rand_idxs[1]]["label"]}',
    )

    assert dash_duo.get_logs() is None
