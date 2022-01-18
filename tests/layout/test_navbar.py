import pytest
from dash import Dash

import dash_mdc_neptune as mdc


@pytest.mark.parametrize(
    "title_kwarg,title_prop",
    [
        (None, ""),
        ("Custom dash", "Custom dash"),
    ],
)
def test_render_navbar(dash_duo, title_kwarg, title_prop):
    app = Dash(name=__name__)
    app.layout = mdc.Dashboard(children=mdc.NavBar(title=title_kwarg))

    dash_duo.start_server(app)
    dash_duo.wait_for_text_to_equal("#navbar", title_prop)

    assert dash_duo.get_logs() is None
