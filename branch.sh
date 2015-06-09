#!/bin/bash
# Resets the environment with some git commands
# Uses a commonly named branch 'brian'

git branch -d brian
git branch brian
git checkout brian

