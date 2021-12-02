import matplotlib as mpl
import matplotlib.pyplot as plt
from cycler import cycler

from . import settings


noos_diverging = mpl.colors.LinearSegmentedColormap.from_list(
    name="noos_diverging", colors=settings._color_scale(settings.NOOS_PALETTE_DIVERGING)
)
plt.register_cmap(cmap=noos_diverging)

noos_sequential = mpl.colors.LinearSegmentedColormap.from_list(
    name="noos_sequential", colors=settings._color_scale(settings.NOOS_PALETTE_SEQUENTIAL)
)
plt.register_cmap(cmap=noos_sequential)

# Noos Deep palette
noos_base = mpl.colors.ListedColormap(name="noos_base", colors=settings.NOOS_PALETTE_BASE)
plt.register_cmap(cmap=noos_base)

cycler_noos_base = cycler("cycler_noos_base", settings.NOOS_PALETTE_BASE)

# Noos Pastel palette
noos_pastel = mpl.colors.ListedColormap(name="noos_pastel", colors=settings.NOOS_PALETTE_PASTELS)
plt.register_cmap(cmap=noos_pastel)

cycler_noos_pastel = cycler("cycler_noos_pastel", settings.NOOS_PALETTE_PASTELS)
