#!/bin/bash

# Script to merge brian branch into main and push
echo "Checking out main branch..."
git checkout main

echo "Merging brian branch into main..."
git merge brian

echo "Pushing changes to remote..."
git push

echo "Checking out brian branch again..."
git checkout brian

echo "Done!"
