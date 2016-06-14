#!/bin/sh

git diff --cached --name-only --diff-filter=ACM | grep '.js$' | xargs npm run eslint || { exit 1; }

# Run tests
npm t

exit $?
