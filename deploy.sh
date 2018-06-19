#!/usr/bin/env bash

rm -R ~/App/gtd-old-backup
mv ~/App/gtd ~/App/gtd-old-backup
cp -fr ./build/Electronic-GTD-linux-x64/ ~/App/
mv ~/App/Electronic-GTD-linux-x64 ~/App/gtd