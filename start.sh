#!/usr/bin/env bash
if [ "${DEBUG}" == true ]; then
  if [ "${DEBUGBRK}" == true ]; then
    echo 'Entering debug mode and breaking.'
    npm run-script debug-brk
  else
    echo 'Entering debug mode.'
    npm run-script debug
  fi
else
  echo 'Entering normal mode.'
  npm start
fi
