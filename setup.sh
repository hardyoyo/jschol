#!/usr/bin/env bash

# If an error occurs, stop this script
set -e

printf "== Installing local Ruby gems ==\n"
bundle install --path=gems --binstubs

printf "\n== Installing npm packages (used by gulp and iso via Node) ==\n"
npm install

printf "\n== Installing bower packages (used in browser) ==\n"
node_modules/.bin/bower install
