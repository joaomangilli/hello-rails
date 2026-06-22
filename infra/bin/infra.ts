#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HelloRailsStack } from '../lib/hello-rails-stack';

const app = new cdk.App();

new HelloRailsStack(app, 'HelloRailsStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
});
