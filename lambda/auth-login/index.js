/**
 * AWS Lambda Function: User Login
 * Uses Amazon Cognito + DynamoDB
 */

const { CognitoIdentityProviderClient, InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }));

const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USERS_TABLE = process.env.USERS_TABLE_NAME || 'bhumi-users';

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { email, password } = body;

        // Step 1: Authenticate with Cognito
        const authParams = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };

        const authResponse = await cognitoClient.send(new InitiateAuthCommand(authParams));
        
        if (!authResponse.AuthenticationResult) {
            throw new Error('Authentication failed');
        }

        const tokens = {
            accessToken: authResponse.AuthenticationResult.AccessToken,
            idToken: authResponse.AuthenticationResult.IdToken,
            refreshToken: authResponse.AuthenticationResult.RefreshToken
        };

        // Step 2: Get user profile from DynamoDB
        // Extract user sub from ID token (simplified - in production, decode JWT properly)
        const idTokenPayload = JSON.parse(Buffer.from(tokens.idToken.split('.')[1], 'base64').toString());
        const userSub = idTokenPayload.sub;

        const userResponse = await dynamoClient.send(new GetCommand({
            TableName: USERS_TABLE,
            Key: { userId: userSub }
        }));

        const user = userResponse.Item || {
            email: email,
            name: idTokenPayload.name || 'Farmer',
            memberSince: new Date().getFullYear().toString()
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                tokens,
                user
            })
        };

    } catch (error) {
        console.error('Login Error:', error);
        return {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Login failed',
                message: error.message || 'Invalid credentials'
            })
        };
    }
};
