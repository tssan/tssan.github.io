#!/bin/bash

action=$1

shift 1

if [ -d ".venv" ]; then
    source .venv/bin/activate
fi


case "$action" in
    init)
        virtualenv -p python3 .venv
        source .venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
    ;;
    clean)
        rm -rf .venv
        rm -rf __pycache__
        rm -rf output
    ;;
    clean-output)
        rm -rf output
    ;;
    dev-dojo)
        pelican -vlr -t themes/dojoit -b 0.0.0.0
    ;;
    dev-simple)
        pelican -vlr
    ;;
    pelican)
        pelican $@
    ;;
esac
