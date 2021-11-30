from .definitions import NOOS_HTML_COLORS


__all__ = ["noos_pd_cell_hover", "noos_pd_row_hover", "noos_pd_headers"]


noos_pd_cell_hover = {
    "selector": "td:hover",
    "props": [("background-color", NOOS_HTML_COLORS["gray"])],
}

noos_pd_row_hover = {
    "selector": "tr:hover",
    "props": [("background-color", NOOS_HTML_COLORS["gray"])],
}

noos_pd_headers = {
    "selector": "th:not(.index_name)",
    "props": f"background-color: {NOOS_HTML_COLORS['primary']}; "
    f"color: {NOOS_HTML_COLORS['dark']};",
}
