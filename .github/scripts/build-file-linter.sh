#!/bin/bash

jsFiles=$(find . \( -name node_modules -o -path ./common \) -prune -o -name '*.js' -print)

if [ -z "$jsFiles" ]
then
      echo "No JS files found, free to proceed"
      exit 0
else
      echo "JS files found, unable to proceed"
      exit 1
fi