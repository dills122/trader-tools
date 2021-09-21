#!/bin/bash

apk add --update bash && rm -rf /var/cache/apk/*
adduser -S app
rm -rf ./common/temp
rush update --purge
rush build
mkdir ./prod
rush deploy --project "$1" --target-folder ./prod
cp ./.env ./prod/
