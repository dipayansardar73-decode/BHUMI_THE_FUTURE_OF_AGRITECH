/**
 * AWS Lambda Function: User Signup
 * Uses Amazon Cognito + DynamoDB
 */

const { CognitoIdentityProviderClient, SignUpCommand, AdminConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }));

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USERS_TABLE = process.env.USERS_TABLE_NAME || 'bhumi-users';

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { email, password, name, attributes } = body;

        // Step 1: Create user in Cognito
        const signUpParams = {
            ClientId: CLIENT_ID,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'name', Value: name },
                { Name: 'custom:location', Value: attributes['custom:location'] || '' },
                { Name: 'custom:farmSize', Value: attributes['custom:farmSize'] || '' },
                { Name: 'custom:soilType', Value: attributes['custom:soilType'] || '' },
                { Name: 'custom:mainCrop', Value: attributes['custom:mainCrop'] || '' },
                { Name: 'custom:irrigationSource', Value: attributes['custom:irrigationSource'] || '' }
            ]
        };

        const signUpResponse = await cognitoClient.send(new SignUpCommand(signUpParams));
        const userSub = signUpResponse.UserSub;

        // Step 2: Auto-confirm user (for demo purposes - remove in production)
        await cognitoClient.send(new AdminConfirmSignUpCommand({
            UserPoolId: USER_POOL_ID,
            Username: email
        }));

        // Step 3: Store user profile in DynamoDB
        const userProfile = {
            userId: userSub,
            email: email,
            name: name,
            location: attributes['custom:location'] || '',
            farmSize: attributes['custom:farmSize'] || '',
            soilType: attributes['custom:soilType'] || '',
            mainCrop: attributes['custom:mainCrop'] || '',
            irrigationSource: attributes['custom:irrigationSource'] || '',
            memberSince: new Date().getFullYear().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await dynamoClient.send(new PutCommand({
            TableName: USERS_TABLE,
            Item: userProfile
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'User created successfully',
                userId: userSub,
                user: userProfile
            })
        };

    } catch (error) {
        console.error('Signup Error:', error);
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Signup failed',
                message: error.message
            })
        };
    }
};
