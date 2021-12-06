# Configuration file for jupyter-nbconvert.

# more info:
# https://nbconvert.readthedocs.io/en/latest/config_options.html
# https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/config.html

c = get_config()

#------------------------------------------------------------------------------
# SlidesExporter(HTMLExporter) configuration
#------------------------------------------------------------------------------
## Exports HTML slides with reveal.js

## This allows you to exclude code cell inputs from all templates if set to True.
#  See also: TemplateExporter.exclude_input
c.SlidesExporter.exclude_input = True

## This allows you to exclude input prompts from all templates if set to True.
#  See also: TemplateExporter.exclude_input_prompt
c.SlidesExporter.exclude_input_prompt = True

## This allows you to exclude output prompts from all templates if set to True.
#  See also: TemplateExporter.exclude_output_prompt
c.SlidesExporter.exclude_output_prompt = True

## This allows you to exclude unknown cells from all templates if set to True.
#  See also: TemplateExporter.exclude_unknown
c.SlidesExporter.exclude_unknown = True

## If True, enable scrolling within each slide
#  Default: False
c.SlidesExporter.reveal_scroll = True
