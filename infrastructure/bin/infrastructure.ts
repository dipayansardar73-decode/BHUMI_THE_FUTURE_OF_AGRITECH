#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BhumiStack } from '../cdk-stack';

const app = new cdk.App();
new BhumiStack(app, 'BhumiStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
app.synth();
