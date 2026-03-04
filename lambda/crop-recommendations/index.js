/**
 * AWS Lambda Function: Crop Recommendations
 * Uses Amazon Bedrock (Claude 3 Sonnet)
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { soil, season, location, language } = body;

        const prompt = `You are an expert agronomist. Suggest the 3 most suitable crops for the following conditions:

Soil Type: ${soil}
Season: ${season}
Location: ${location}

For each crop, provide:
1. Crop name
2. Suitability percentage (0-100)
3. Reason why it's suitable
4. Growing duration

Respond in ${language} language.

Return ONLY a JSON array in this exact format:
[
    {
        "name": "Crop Name",
        "suitability": 95,
        "reason": "Detailed reason for suitability",
        "duration": "90-120 days"
    }
]`;

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 2000,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        const resultText = responseBody.content[0].text;
        
        // Extract JSON array from response
        const jsonMatch = resultText.match(/\[[\s\S]*\]/);
        const recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ recommendations })
        };

    } catch (error) {
        console.error('Crop Recommendation Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Crop recommendation failed',
                message: error.message,
                recommendations: []
            })
        };
    }
};
