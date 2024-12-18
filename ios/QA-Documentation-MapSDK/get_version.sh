#! /bin/bash

LAST_TAG=$(git describe --first-parent @)
regex="^(.*)-([0-9.]*)(-([0-9.]*)-g.{4,})?$"

if [[ $LAST_TAG =~ $regex ]]
then
        RELEASE_VERSION="${BASH_REMATCH[2]}"
        BUILD_NUMBER="${BASH_REMATCH[4]:-0}"
else
                exit
fi
export RELEASE_VERSION="${RELEASE_VERSION}"
export BUILD_NUMBER="${BUILD_NUMBER}"
echo "${RELEASE_VERSION}.${BUILD_NUMBER}"
