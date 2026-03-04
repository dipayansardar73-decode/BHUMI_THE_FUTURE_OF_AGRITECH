/**
 * AWS Lambda Function: Voice Agent Chat
 * Uses Amazon Bedrock (Claude 3 Haiku for speed)
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { message } = body;

        const systemPrompt = `You are Bhumi, a magical farm spirit voice assistant. 
Keep answers VERY short (1-2 sentences maximum), conversational, and helpful. 
You are talking to a farmer. Be instant, warm, and friendly.`;

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 150,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        };

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0", // Haiku for speed
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
        console.error('Voice Chat Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Voice chat failed',
                message: error.message,
                reply: "I am having trouble hearing you clearly."
            })
        };
    }
};
