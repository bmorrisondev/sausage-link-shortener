# GitHub Actions Setup for Convex Deployment

This document explains how to set up the GitHub Actions workflow for automatically deploying Convex changes to production.

## Workflow Overview

The GitHub Actions workflow (`deploy-convex.yml`) will:
- Trigger when changes are pushed to the `main` branch in the `convex/` directory
- Install dependencies using pnpm
- Deploy the Convex changes to production using the Convex CLI

## Setting Up the Required Secret

To enable the workflow to deploy to your Convex production environment, you need to add a GitHub Secret:

1. **Get your Convex Deploy Key**:
   - Go to the [Convex Dashboard](https://dashboard.convex.dev)
   - Select your project
   - Navigate to Settings > API Keys
   - Create a new deploy key with production deployment permissions

2. **Add the Secret to GitHub**:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `CONVEX_DEPLOY_KEY`
   - Value: Paste your Convex deploy key
   - Click "Add secret"

## Manual Deployment

You can also manually trigger the workflow from the GitHub Actions tab by selecting the "Deploy Convex to Production" workflow and clicking "Run workflow".

## Troubleshooting

If the workflow fails:
- Check that the `CONVEX_DEPLOY_KEY` secret is correctly set
- Verify that your Convex deploy key has production deployment permissions
- Ensure your Convex project is properly configured
