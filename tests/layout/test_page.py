from dash import Dash

import dash_mdc_neptune as mdc


def test_render_page(dash_duo):
    text = "Content..."
    component = "p"
    app = Dash(name=__name__)
    app.layout = mdc.Dashboard(
        children=mdc.Page(
            orientation="columns",
            children=mdc.Section(
                orientation="columns",
                children=mdc.Typography(text=text, component=component, variant="body2"),
                cards=[{"title": "Card"}],
            ),
        )
    )

    dash_duo.start_server(app)
    element = (
        dash_duo.find_element("#page").find_element_by_id("section").find_element_by_id("text")
    )

    assert element.find_element_by_tag_name(component).text == text
    assert dash_duo.get_logs() is None
