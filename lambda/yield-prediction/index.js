/**
 * AWS Lambda Function: Yield Prediction
 * Uses Amazon Bedrock (Claude 3 Sonnet) + Optional SageMaker ML Model
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { crop, area, soil, season, previous, irrigation, seed, language } = body;

        const prompt = `You are an expert agronomist specializing in yield prediction. Analyze the following farm data and predict the crop yield:

Crop: ${crop}
Area: ${area} acres
Soil Type: ${soil}
Season: ${season}
Previous Crop: ${previous}
Irrigation: ${irrigation}
Seed Variety: ${seed}

Provide a comprehensive yield prediction in ${language} language.

Return ONLY a JSON object in this exact format:
{
    "predicted_yield": "2.5 - 3.0",
    "unit": "Tonnes per Acre",
    "confidence": 85,
    "influencing_factors": [
        "Factor 1",
        "Factor 2",
        "Factor 3"
    ],
    "suggestions": "Detailed agronomic suggestions to optimize yield"
}`;

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
        
        // Extract JSON from response
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
            predicted_yield: "0",
            unit: "Tonnes",
            confidence: 0,
            influencing_factors: [],
            suggestions: "Unable to predict yield"
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Yield Prediction Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Yield prediction failed',
                message: error.message
            })
        };
    }
};
