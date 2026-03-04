/**
 * AWS Lambda Function: Chat with Bhumi
 * Uses Amazon Bedrock (Claude 3 Sonnet)
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { history, message, language } = body;

        // Build conversation history for Claude
        const messages = [
            ...history,
            {
                role: "user",
                content: message
            }
        ];

        const systemPrompt = `You are Bhumi, a wise and friendly agricultural expert assistant for farmers.

Your Personality:
- Warm, human-like, and encouraging
- Speak like a knowledgeable neighbor, not a robot
- Provide practical, empathetic advice

Your Capabilities:
- Help farmers with crop management, disease identification, weather planning
- Provide market insights and best practices
- Answer questions about irrigation, fertilizers, pesticides, and soil health

Language Rule: You MUST respond ONLY in ${language}.

Guidelines:
- Keep paragraphs short and conversational
- Use simple language that farmers can understand
- Provide actionable advice
- Be supportive and positive`;

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 2000,
            system: systemPrompt,
            messages: messages
        };

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        const reply = responseBody.content[0].text;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ reply })
        };

    } catch (error) {
        console.error('Chat Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Chat failed',
                message: error.message,
                reply: "I'm having trouble connecting right now. Please try again."
            })
        };
    }
};
