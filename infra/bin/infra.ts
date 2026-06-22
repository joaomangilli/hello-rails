#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HelloRailsStack } from '../lib/hello-rails-stack';
import { resolveEnv } from '../lib/environments';

const app = new cdk.App();

// The target environment is chosen at deploy time: `cdk deploy -c env=QA|PROD`.
// The Deploy GitHub Actions workflow passes this based on the dispatch input.
const envConfig = resolveEnv(app.node.tryGetContext('env'));

const stack = new HelloRailsStack(app, `HelloRails-${envConfig.name}`, {
  envConfig,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
});

// Tag everything so resources are easy to attribute to an environment.
cdk.Tags.of(stack).add('Environment', envConfig.name);
