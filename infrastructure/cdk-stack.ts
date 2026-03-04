/**
 * AWS CDK Stack for BHUMI Smart Farming Assistant
 * Infrastructure as Code
 */

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class BhumiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ========================================
    // 1. DynamoDB Tables
    // ========================================
    
    const usersTable = new dynamodb.Table(this, 'BhumiUsersTable', {
      tableName: 'bhumi-users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true
    });

    const diseaseHistoryTable = new dynamodb.Table(this, 'BhumiDiseaseHistoryTable', {
      tableName: 'bhumi-disease-history',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    // ========================================
    // 2. S3 Bucket for Image Storage
    // ========================================
    
    const imagesBucket = new s3.Bucket(this, 'BhumiImagesBucket', {
      bucketName: `bhumi-crop-images-${this.account}`,
      cors: [{
        allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
        allowedOrigins: ['*'],
        allowedHeaders: ['*']
      }],
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    // ========================================
    // 3. Cognito User Pool
    // ========================================
    
    const userPool = new cognito.UserPool(this, 'BhumiUserPool', {
      userPoolName: 'bhumi-user-pool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false
      },
      customAttributes: {
        location: new cognito.StringAttribute({ mutable: true }),
        farmSize: new cognito.StringAttribute({ mutable: true }),
        soilType: new cognito.StringAttribute({ mutable: true }),
        mainCrop: new cognito.StringAttribute({ mutable: true }),
        irrigationSource: new cognito.StringAttribute({ mutable: true })
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const userPoolClient = userPool.addClient('BhumiWebClient', {
      authFlows: {
        userPassword: true,
        userSrp: true
      },
      generateSecret: false
    });

    // ========================================
    // 4. IAM Role for Lambda Functions
    // ========================================
    
    const lambdaRole = new iam.Role(this, 'BhumiLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // Grant Bedrock access
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream'
      ],
      resources: ['*']
    }));

    // Grant AWS Marketplace permissions for Bedrock models
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'aws-marketplace:ViewSubscriptions',
        'aws-marketplace:Subscribe'
      ],
      resources: ['*']
    }));

    // Grant Rekognition access
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['rekognition:DetectLabels', 'rekognition:DetectText'],
      resources: ['*']
    }));

    // Grant DynamoDB access
    usersTable.grantReadWriteData(lambdaRole);
    diseaseHistoryTable.grantReadWriteData(lambdaRole);

    // Grant S3 access
    imagesBucket.grantReadWrite(lambdaRole);

    // Grant Cognito access
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'cognito-idp:AdminConfirmSignUp',
        'cognito-idp:AdminGetUser',
        'cognito-idp:AdminUpdateUserAttributes'
      ],
      resources: [userPool.userPoolArn]
    }));

    // ========================================
    // 5. Lambda Functions
    // ========================================
    
    const commonEnv = {
      USERS_TABLE_NAME: usersTable.tableName,
      DISEASE_HISTORY_TABLE: diseaseHistoryTable.tableName,
      IMAGES_BUCKET: imagesBucket.bucketName,
      COGNITO_USER_POOL_ID: userPool.userPoolId,
      COGNITO_CLIENT_ID: userPoolClient.userPoolClientId
    };

    // Disease Detection Lambda
    const diseaseDetectionFn = new lambda.Function(this, 'DiseaseDetectionFunction', {
      functionName: 'bhumi-disease-detection',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/disease-detection'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      role: lambdaRole,
      environment: commonEnv
    });

    // Chat Lambda
    const chatFn = new lambda.Function(this, 'ChatFunction', {
      functionName: 'bhumi-chat',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/chat'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      role: lambdaRole,
      environment: commonEnv
    });

    // Crop Recommendations Lambda
    const cropRecommendationsFn = new lambda.Function(this, 'CropRecommendationsFunction', {
      functionName: 'bhumi-crop-recommendations',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/crop-recommendations'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      role: lambdaRole,
      environment: commonEnv
    });

    // Yield Prediction Lambda
    const yieldPredictionFn = new lambda.Function(this, 'YieldPredictionFunction', {
      functionName: 'bhumi-yield-prediction',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/yield-prediction'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      role: lambdaRole,
      environment: commonEnv
    });

    // Weather Forecast Lambda
    const weatherForecastFn = new lambda.Function(this, 'WeatherForecastFunction', {
      functionName: 'bhumi-weather-forecast',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/weather-forecast'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      role: lambdaRole,
      environment: {
        ...commonEnv,
        WEATHER_API_KEY: process.env.WEATHER_API_KEY || ''
      }
    });

    // Smart Advisory Lambda
    const smartAdvisoryFn = new lambda.Function(this, 'SmartAdvisoryFunction', {
      functionName: 'bhumi-smart-advisory',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/smart-advisory'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      role: lambdaRole,
      environment: commonEnv
    });

    // Analytics Insight Lambda
    const analyticsInsightFn = new lambda.Function(this, 'AnalyticsInsightFunction', {
      functionName: 'bhumi-analytics-insight',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/analytics-insight'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      role: lambdaRole,
      environment: commonEnv
    });

    // Voice Chat Lambda
    const voiceChatFn = new lambda.Function(this, 'VoiceChatFunction', {
      functionName: 'bhumi-voice-chat',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/voice-chat'),
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      role: lambdaRole,
      environment: commonEnv
    });

    // Auth Signup Lambda
    const authSignupFn = new lambda.Function(this, 'AuthSignupFunction', {
      functionName: 'bhumi-auth-signup',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/auth-signup'),
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      role: lambdaRole,
      environment: commonEnv
    });

    // Auth Login Lambda
    const authLoginFn = new lambda.Function(this, 'AuthLoginFunction', {
      functionName: 'bhumi-auth-login',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/auth-login'),
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      role: lambdaRole,
      environment: commonEnv
    });

    // ========================================
    // 6. API Gateway
    // ========================================
    
    const api = new apigateway.RestApi(this, 'BhumiApi', {
      restApiName: 'bhumi-api',
      description: 'BHUMI Smart Farming Assistant API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    // Auth endpoints
    const authResource = api.root.addResource('auth');
    authResource.addResource('signup').addMethod('POST', new apigateway.LambdaIntegration(authSignupFn));
    authResource.addResource('login').addMethod('POST', new apigateway.LambdaIntegration(authLoginFn));

    // AI endpoints
    api.root.addResource('disease-detection').addMethod('POST', new apigateway.LambdaIntegration(diseaseDetectionFn));
    api.root.addResource('chat').addMethod('POST', new apigateway.LambdaIntegration(chatFn));
    api.root.addResource('crop-recommendations').addMethod('POST', new apigateway.LambdaIntegration(cropRecommendationsFn));
    api.root.addResource('yield-prediction').addMethod('POST', new apigateway.LambdaIntegration(yieldPredictionFn));
    api.root.addResource('weather-forecast').addMethod('POST', new apigateway.LambdaIntegration(weatherForecastFn));
    api.root.addResource('smart-advisory').addMethod('POST', new apigateway.LambdaIntegration(smartAdvisoryFn));
    api.root.addResource('analytics-insight').addMethod('POST', new apigateway.LambdaIntegration(analyticsInsightFn));
    api.root.addResource('voice-chat').addMethod('POST', new apigateway.LambdaIntegration(voiceChatFn));

    // ========================================
    // 7. Outputs
    // ========================================
    
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito User Pool ID'
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID'
    });

    new cdk.CfnOutput(this, 'ImagesBucketName', {
      value: imagesBucket.bucketName,
      description: 'S3 Bucket for Images'
    });
  }
}
