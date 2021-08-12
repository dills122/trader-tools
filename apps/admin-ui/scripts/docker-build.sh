#!/bin/bash

npm install -g @microsoft/rush
rush unlink
rm -rf common/temp
rush update --purge
rush install
rush build

mkdir ../prod
rush deploy --project admin-ui --target-folder ../prod