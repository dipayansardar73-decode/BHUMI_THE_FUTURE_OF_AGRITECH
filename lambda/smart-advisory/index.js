/**
 * AWS Lambda Function: Smart Advisory
 * Uses Amazon Bedrock (Claude 3 Sonnet)
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { crop, stage, problem, language } = body;

        const prompt = `You are an expert agricultural advisor. Provide specific farming advice for:

Crop: ${crop}
Growth Stage: ${stage}
${problem ? `Specific Problem: ${problem}` : 'General Care'}

Provide detailed recommendations in ${language} language for:
1. Irrigation management
2. Fertilizer application
3. Pest and disease control

Return ONLY a JSON object in this exact format:
{
    "irrigation": "Detailed irrigation advice with specific timing and quantity",
    "fertilizer": "Specific fertilizer recommendations with NPK ratios and application methods",
    "pesticides": "Pest control measures, including organic and chemical options if needed"
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
            irrigation: "N/A",
            fertilizer: "N/A",
            pesticides: "N/A"
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
        console.error('Smart Advisory Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Advisory generation failed',
                message: error.message,
                irrigation: "N/A",
                fertilizer: "N/A",
                pesticides: "N/A"
            })
        };
    }
};
