#!/bin/bash

yarn proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=generated/ src/services/**/*.proto
