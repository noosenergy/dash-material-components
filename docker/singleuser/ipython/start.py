# Create Neptune aliases
import neptune_analytics as npta
import neptune_energy_client as nptc
from voila_neptune import themes as nptt

# Configure plotting backends
import plotly.io as pio


pio.templates.default = "noos_base+noos_colorscale+noos_watermark"
