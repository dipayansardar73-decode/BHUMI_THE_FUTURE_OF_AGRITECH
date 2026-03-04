/**
 * AWS Lambda Function: Analytics Insight
 * Uses Amazon Bedrock (Claude 3 Sonnet)
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { data, language } = body;

        const prompt = `You are an agricultural business analyst. Analyze the following farm data and provide strategic insights in ${language} language:

Data:
${JSON.stringify(data, null, 2)}

Provide:
1. Key trends and patterns
2. Financial performance analysis
3. Recommendations for improvement
4. Market opportunities

Keep the analysis concise (3-4 paragraphs) and actionable for farmers.`;

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1500,
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
        
        const insight = responseBody.content[0].text;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ insight })
        };

    } catch (error) {
        console.error('Analytics Insight Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Analytics generation failed',
                message: error.message,
                insight: "Could not generate analysis."
            })
        };
    }
};
