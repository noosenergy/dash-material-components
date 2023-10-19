from typing import Callable

import pytest
from dash import Dash, Input, Output

import dash_material_components as mdc


DATA = [
    {"name": "Alice", "age": 25, "gender": "Female", "salary": 50000},
    {"name": "Bob", "age": 30, "gender": "Male", "salary": 60000},
    {"name": "Charlie", "age": 35, "gender": "Male", "salary": 70000},
    {"name": "David", "age": 40, "gender": "Male", "salary": 80000},
    {"name": "Eve", "age": 45, "gender": "Female", "salary": 90000},
    {"name": "Frank", "age": 50, "gender": "Male", "salary": 100000},
    {"name": "Grace", "age": 55, "gender": "Female", "salary": 110000},
    {"name": "Henry", "age": 60, "gender": "Male", "salary": 120000},
    {"name": "Isabella", "age": 65, "gender": "Female", "salary": 130000},
]

COLUMNS = [
    {"field": "Name", "width": 70},
    {"field": "Age", "width": 50},
    {"field": "Gender", "width": 70},
    {"field": "Salary"},
]

ROWS_PER_PAGE_OPTIONS = [5, 10, 20]

DROPDOWN_OPTIONS = ["Male", "Female"]


@pytest.fixture
def dash_app() -> Callable[..., Dash]:
    def app_factory() -> Dash:
        app = Dash(name=__name__)
        app.layout = mdc.Dashboard(
            children=[
                mdc.Page(
                    orientation="columns",
                    children=mdc.Section(
                        orientation="columns",
                        children=mdc.Box(
                            children=[
                                mdc.Table(
                                    id="table",
                                    rows=DATA,
                                    columns=COLUMNS,
                                    rowsPerPageOptions=ROWS_PER_PAGE_OPTIONS,
                                ),
                                mdc.Dropdown(
                                    id="dropdown",
                                    options=DROPDOWN_OPTIONS,
                                    selected=DROPDOWN_OPTIONS,
                                ),
                            ],
                        ),
                        cards=[{"title": "Card"}],
                    ),
                ),
                mdc.Alert(id="alert"),
            ]
        )

        @app.callback(
            Output(component_id="table", component_property="rows"),
            Input(component_id="dropdown", component_property="selected"),
        )
        def update_table_rows(selected: str) -> list:
            return [row for row in DATA if row["gender"] in selected]

        return app

    return app_factory


def test_table(dash_duo, dash_app):
    row_per_page = ROWS_PER_PAGE_OPTIONS[0]
    dash_duo.start_server(dash_app())

    rows = dash_duo.find_element("#table").find_elements_by_tag_name("tr")

    assert len(rows) == row_per_page + 1
    assert rows[0].text == "Name Age Gender Salary"
    for i in range(1, len(rows)):
        assert rows[i].text == " ".join(str(e) for e in DATA[i - 1].values())

    dash_duo.find_element("#table").find_element_by_xpath('//*[@title="Next page"]').click()
    rows = dash_duo.find_element("#table").find_elements_by_tag_name("tr")

    assert len(rows) == len(DATA) - row_per_page + 1
    assert rows[0].text == "Name Age Gender Salary"
    for i in range(1, len(rows)):
        assert rows[i].text == " ".join(str(e) for e in DATA[row_per_page + i - 1].values())


def test_table_select(dash_duo, dash_app):
    dash_duo.start_server(dash_app())

    dash_duo.find_element("#dropdown-select").click()
    elements = dash_duo.find_element("#menu-").find_elements_by_tag_name("li")
    elements[0].click()
    elements[1].click()
    rows = dash_duo.find_element("#table").find_elements_by_tag_name("tr")
    assert len(rows) == 1

    elements[0].click()
    for i in range(1, len(rows)):
        assert rows[i].split(" ")[2] == DROPDOWN_OPTIONS[0]

    assert dash_duo.get_logs() is None
