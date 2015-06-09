#!/bin/bash
# Commit with some git commands

### Main script stars here ###
case "$1" in
  "") echo "Usage: ${0##*/} <commit message>"; exit $E_PARAM;;
                      # No command-line parameters,
                      # or first parameter empty.
# Note that ${0##*/} is ${var##pattern} param substitution.
                      # Net result is $0.
esac
git add -A
git commit -a -m "$1"
git checkout master
git merge brian --no-ff -m "$1"
# Speculative unsetting of this session var
unset SSH_ASKPASS
git push
