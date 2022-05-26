#!/bin/bash

# Packages that we want to publish
declare -a Packages=("browserExtension" "placeholder")

# Iterate through the packages
for packageName in ${Packages[@]}; do

  REPO_NPM_VERSION=$(node -p "require('./packages/${packageName}/package.json').version")

  PUBLIC_NPM_VERSION=$(npm show @SnickerdoodleLabs/${packageName} version)

  # Check for the version difference between the repo and npm
  if [ $REPO_NPM_VERSION == $PUBLIC_NPM_VERSION ]
  then
    echo "${packageName}@${REPO_NPM_VERSION} versions are equal, no need to publish"
  else
    echo "${packageName}@${REPO_NPM_VERSION} versions are not equal, publish the new version"
    
    cd packages/${packageName} && npm publish --access public && cd ../../
  fi

done

exit
