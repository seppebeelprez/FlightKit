@echo off

set homesteadRoot=%HOMEDRIVE%%HOMEPATH%\.artestead

mkdir "%homesteadRoot%"

copy /-y src\stubs\Artestead.yaml "%homesteadRoot%\Artestead.yaml"
copy /-y src\stubs\after.sh "%homesteadRoot%\after.sh"
copy /-y src\stubs\aliases.sh "%homesteadRoot%\aliases.sh"

set homesteadRoot=
echo Artestead initialized!
