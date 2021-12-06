# https://github.com/jupyter/docker-stacks
# https://hub.docker.com/u/jupyter/
FROM jupyter/base-notebook:python-3.8.6

USER root

# Install Apt packages
# --------------------
COPY package.list /tmp/
RUN apt-get update \
    && grep -vE '^#' /tmp/package.list | xargs apt-get install -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/fontconfig/*

# Install Conda packages
# ----------------------
COPY environment.yml /tmp/
RUN conda env update -q -f /tmp/environment.yml \
    && conda clean --all -f -y

# Install Lab extensions
# ----------------------
# https://github.com/plotly/plotly.py
# https://www.npmjs.com/package/jupyterlab-plotly
# https://github.com/jupyter-widgets/ipywidgets
# https://www.npmjs.com/package/@jupyter-widgets/jupyterlab-manager
# https://github.com/jupyterlab/jupyterlab-git
ARG LAB_EXTENSIONS=" \
    @jupyter-widgets/jupyterlab-manager \
    jupyterlab-plotly \
    plotlywidget \
    "

RUN jupyter labextension install --no-build --clean $LAB_EXTENSIONS \
    && rm -rf /tmp/* \
    && rm -rf ${HOME}/.cache ${HOME}/.npm ${HOME}/.yarn \
    && find ${CONDA_DIR} -follow -type f -name '*.a' -delete \
    && find ${CONDA_DIR} -follow -type f -name '*.pyc' -delete \
    && find ${CONDA_DIR} -follow -type f -name '*.js.map' -delete \
    && fix-permissions $CONDA_DIR

# Configure Lab extensions
# ------------------------
# https://jupyterlab.readthedocs.io/en/stable/user/extensions.html#settings
COPY lab/. ${CONDA_DIR}/share/jupyter/lab/settings

# Configure nbconvert
# -------------------
COPY nbconvert/. /home/$NB_USER/.jupyter

# Build Lab extensions
# --------------------
ARG NODE_OPTIONS=--max-old-space-size=4096
RUN jupyter lab clean \
    && jupyter lab build --dev-build=False --name='Neptune'

USER $NB_UID
