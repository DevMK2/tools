#!/usr/bin/env zsh

_TOOLS_ROOT_PATH=$(builtin cd "`dirname "$0"`" > /dev/null && pwd)
export TOOLS_ROOT_PATH=$_TOOLS_ROOT_PATH
export PATH=$_TOOLS_ROOT_PATH/'run':${PATH}
export PYTHONPATH=$_TOOLS_ROOT_PATH/'import':${PYTHONPATH}
