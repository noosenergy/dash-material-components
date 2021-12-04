"""Module to register multiple plotly templates to give a consistent feel across dashboards."""

import plotly.graph_objects as go
import plotly.io as pio

from . import base, utils


# Template for adding a demo watermark
pio.templates["demo"] = go.layout.Template(
    layout_annotations=[
        dict(
            name="demo watermark",
            text="DEMO",
            textangle=-30,
            opacity=0.1,
            font=dict(color="black", size=100),
            xref="paper",
            yref="paper",
            x=0.5,
            y=0.5,
            showarrow=False,
        )
    ]
)

# Template for adding a noos watermark
pio.templates["noos_watermark"] = go.layout.Template(
    layout_images=[
        dict(
            source=utils._get_img_uri("logo.png"),
            name="noos_watermark",
            xref="paper",
            yref="paper",
            xanchor="center",
            yanchor="middle",
            x=0.5,
            y=0.5,
            sizex=0.7,
            sizey=0.7,
            opacity=0.13,
        )
    ]
)

# Template for period axis for prices
pio.templates["xaxis_period"] = go.layout.Template(
    layout_xaxis=dict(
        autorange=True,
        ticklabelmode="period",
        tickangle=0,
        showgrid=True,
        type="date",
    ),
)

# Template for monthly ticks with year only
pio.templates["xaxis_monthyear"] = go.layout.Template(
    layout_xaxis=dict(
        tickformat="%b\n%Y",
    ),
)

# Template to reduce modebar
pio.templates["min_modebar"] = go.layout.Template(
    layout_modebar=dict(
        remove=[
            "zoom",
            "zoomin",
            "zoomout",
            "autoscale",
            "toimage",
            "pan",
            "lasso",
            "select",
        ]
    ),
)

# Template for scatter graph for price
pio.templates["scatter_price"] = go.layout.Template(
    data_scattergl=[
        go.Scattergl(
            mode="lines",
            line_shape="vh",
            marker=None,
            connectgaps=False,
        )
    ],
)

# Template for xunified hoover and custom display
pio.templates["hoover_xunified"] = go.layout.Template(
    layout_hovermode="x unified",
    data_scattergl=[
        go.Scattergl(
            xhoverformat="<b>%d %b %Y</b>",
            hovertemplate="%{y:,.2f}",
        )
    ],
)

# Noos Colorscale Palette
pio.templates["noos_colorscale"] = go.layout.Template(
    layout_colorscale=dict(
        diverging=utils._to_colourscale(base.NOOS_PALETTE_DIVERGING),
        sequential=utils._to_colourscale(base.NOOS_PALETTE_SEQUENTIAL),
        sequentialminus=utils._to_colourscale(base.NOOS_PALETTE_SEQUENTIAL),
    ),
)

# Noos Colorway Palettes
pio.templates["noos_base"] = go.layout.Template(
    layout_colorway=base.NOOS_PALETTE_BASE,
)

pio.templates["noos_pastel"] = go.layout.Template(
    layout_colorway=base.NOOS_PALETTE_PASTELS,
)

pio.templates["noos_diverging"] = go.layout.Template(
    layout_colorway=base.NOOS_PALETTE_DIVERGING,
)

pio.templates["noos_sequential"] = go.layout.Template(
    layout_colorway=base.NOOS_PALETTE_SEQUENTIAL,
)
