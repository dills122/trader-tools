#!/bin/bash

npm install -g @microsoft/rush
rush unlink
rm -rf common/temp
rush update --purge
rush install
rush build
npm --prefix ./apps/sentiment-rpc-server/ run cert:gen

mkdir ../prod
rush deploy --project sentiment-rpc-server --target-folder ../prod
