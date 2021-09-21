#!/bin/bash

rm -rf common/temp
rush install
rush build

mkdir ./prod
rush deploy --project cron-app --target-folder ./prod
