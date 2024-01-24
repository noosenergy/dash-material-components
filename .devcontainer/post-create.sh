#!/bin/sh

# Stop script execution at error
set -e

# Install js libs
# ---------------
echo "$(date) - installing javascript libraries"
yarn install --frozen-lockfile

# Install py libs
# ---------------
echo "$(date) - installing python libraries"
poetry install --with dev

# Build Dash assets
# -----------------
echo "$(date) - building Dash assets"
yarn build
