#!/usr/bin/env bash

homesteadRoot=~/.artestead

mkdir -p "$homesteadRoot"

cp -i src/stubs/Artestead.yaml "$homesteadRoot/Artestead.yaml"
cp -i src/stubs/after.sh "$homesteadRoot/after.sh"
cp -i src/stubs/aliases.sh "$homesteadRoot/aliases.sh"

echo "Artestead initialized!"
