#!/bin/bash

# This script needs to start 3 processes: 1) puma; 2) node/isomorphic; 3) gulp

#1) puma: bundle exec puma -b unix:///var/run/puma/my_app.sock -t1:16 -w 3
bundle exec puma -b unix:///var/run/puma/my_app.sock -t1:16 -w 3

#2) iso: node app/isomorphic.js
node app/isomorphic.js

#3) gulp
node_modules/.bin/gulp
