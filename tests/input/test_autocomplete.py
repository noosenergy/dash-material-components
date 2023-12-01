import random
from typing import Callable, List

import pytest
from dash import Dash, Input, Output

import dash_material_components as mdc


options = [
    {"label": "option_a", "value": "value_a"},
    {"label": "option_b", "value": "value_b"},
    {"label": "option_c", "value": "value_c"},
]

NO_SELECTION_TEXT = "Please select an option"


@pytest.fixture(scope="module")
def dash_app() -> Callable[[List[dict], bool, bool], Dash]:
    def app_factory(
        selected: List[dict] = [], multiple: bool = False, free_solo: bool = False
    ) -> Dash:
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
                                freeSolo=free_solo,
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
                return NO_SELECTION_TEXT

        return app

    return app_factory


def test_no_selection(dash_duo, dash_app):
    dash_duo.start_server(dash_app())
    dash_duo.wait_for_text_to_equal("#text", NO_SELECTION_TEXT)
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

    elements = dash_duo.find_element("#autocomplete-input-popup").find_elements_by_tag_name("li")

    # Select the option
    elements[index].click()
    # Test that the text is updated
    dash_duo.wait_for_text_to_equal("#text", f'You have selected: {options[index]["label"]}')

    assert dash_duo.get_logs() is None


def test_multiple_selection(dash_duo, dash_app):
    # Pick 2 random options to select
    rand_idxs = random.sample(range(len(options)), 2)

    dash_duo.start_server(dash_app(multiple=True))
    # Open popup
    dash_duo.find_element("button[title=Open]").click()

    # select the options
    for index in rand_idxs:
        # Get list of options
        elements = dash_duo.find_element("#autocomplete-input-popup").find_elements_by_tag_name(
            "li"
        )
        # Click on the option
        elements[index].click()

    dash_duo.wait_for_text_to_equal(
        "#text",
        f'You have selected: {options[rand_idxs[0]]["label"]}, {options[rand_idxs[1]]["label"]}',
    )

    assert dash_duo.get_logs() is None


def test_allow_new_value_not_in_options(dash_duo, dash_app):
    dash_duo.start_server(dash_app(free_solo=True))
    dash_duo.find_element("#autocomplete").click()

    # Type a new value
    dash_duo.find_element("#autocomplete-input").send_keys("new_value")
    # Type enter
    dash_duo.find_element("#autocomplete-input").send_keys("\ue007")

    dash_duo.wait_for_text_to_equal("#text", "You have selected: new_value")

    assert dash_duo.get_logs() is None


def test_not_allow_new_value_not_in_options(dash_duo, dash_app):
    dash_duo.start_server(dash_app(free_solo=False))
    dash_duo.find_element("#autocomplete").click()

    # Type a new value
    dash_duo.find_element("#autocomplete-input").send_keys("new_value")
    # Type enter
    dash_duo.find_element("#autocomplete-input").send_keys("\ue007")

    dash_duo.wait_for_text_to_equal("#text", NO_SELECTION_TEXT)

    assert dash_duo.get_logs() is None


def test_multiple_allow_new_value_not_in_options(dash_duo, dash_app):
    dash_duo.start_server(
        dash_app(selected=[options[1], options[2]], multiple=True, free_solo=True)
    )
    dash_duo.find_element("#autocomplete").click()

    # Type a new value
    dash_duo.find_element("#autocomplete-input").send_keys("new_value")
    # Type enter
    dash_duo.find_element("#autocomplete-input").send_keys("\ue007")

    dash_duo.wait_for_text_to_equal(
        "#text", f'You have selected: {options[1]["label"]}, {options[2]["label"]}, new_value'
    )

    assert dash_duo.get_logs() is None


def test_multiple_not_allow_new_value_not_in_options(dash_duo, dash_app):
    dash_duo.start_server(
        dash_app(selected=[options[1], options[2]], multiple=True, free_solo=False)
    )
    dash_duo.find_element("#autocomplete").click()

    # Type a new value
    dash_duo.find_element("#autocomplete-input").send_keys("new_value")
    # Type enter
    dash_duo.find_element("#autocomplete-input").send_keys("\ue007")

    dash_duo.wait_for_text_to_equal(
        "#text", f'You have selected: {options[1]["label"]}, {options[2]["label"]}'
    )

    assert dash_duo.get_logs() is None
