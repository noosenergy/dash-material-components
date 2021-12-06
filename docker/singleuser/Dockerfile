FROM noosenergy/jupyterlab:dash AS builder
# https://hub.docker.com/u/noosenergy/

USER root

# Configure git agent
# -------------------
ARG GITHUB_TOKEN
RUN echo https://${GITHUB_TOKEN}:@github.com > ~/.git-credentials && \
    git config --global credential.helper store

# Install Pipenv
# --------------
ARG PIP_NO_CACHE_DIR=0
ARG PIPENV_RELEASE="2020.11.4"
RUN pip install pipenv==$PIPENV_RELEASE

# Install python libs
# -------------------
WORKDIR /tmp/lib
COPY Pipfile* ./
RUN pipenv install --system --deploy && \
    pip install src/*/


# ------------------
# Multi-stage-build:
# ------------------

FROM noosenergy/jupyterlab:dash

USER root

# Copy python dependencies
# ------------------------
COPY --from=builder $CONDA_DIR/lib/python3.8/site-packages $CONDA_DIR/lib/python3.8/site-packages
COPY --from=builder $CONDA_DIR/share/jupyter $CONDA_DIR/share/jupyter
RUN fix-permissions $CONDA_DIR/lib/python3.8/site-packages
RUN fix-permissions $CONDA_DIR/share/jupyter

# Configure iPython
# -----------------
COPY ipython/. /home/$NB_USER/.ipython/profile_default/startup

# Configure git
# -------------
COPY git/nbstrip /home/$NB_USER/.config/neptune/
COPY git/.gitconfig /home/$NB_USER/

# Configure jupyterlab
# --------------------
# https://jupyterlab.readthedocs.io/en/stable/user/extensions.html#settings
COPY lab/. ${CONDA_DIR}/share/jupyter/lab/settings

# Cache matplotlib backend
# ------------------------
ENV XDG_CACHE_HOME=/home/$NB_USER/.cache/
RUN MPLBACKEND=Agg python -c "import matplotlib.pyplot" && \
    fix-permissions /home/$NB_USER

WORKDIR /home/$NB_USER
USER $NB_UID
