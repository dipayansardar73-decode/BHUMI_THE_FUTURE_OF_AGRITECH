/**
 * AWS Lambda Function: Disease Detection
 * Uses Amazon Bedrock (Claude 3 Sonnet with Vision) + Rekognition
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { RekognitionClient, DetectLabelsCommand } = require('@aws-sdk/client-rekognition');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const rekognitionClient = new RekognitionClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { image, language } = body; // image is base64 encoded

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(image, 'base64');

        // Step 1: Use Rekognition for initial analysis
        const rekognitionParams = {
            Image: { Bytes: imageBuffer },
            MaxLabels: 10,
            MinConfidence: 70
        };

        const rekognitionResponse = await rekognitionClient.send(
            new DetectLabelsCommand(rekognitionParams)
        );

        const labels = rekognitionResponse.Labels.map(l => l.Name).join(', ');

        // Step 2: Use Claude 3 Sonnet with Vision for detailed disease analysis
        const prompt = `You are an expert agricultural pathologist. Analyze this crop image for diseases.

Detected visual elements: ${labels}

Provide a detailed analysis in ${language} language with:
1. Disease name (or "Healthy" if no disease detected)
2. Confidence level (0-100)
3. Treatment recommendations
4. Preventative measures

Respond in JSON format:
{
    "disease": "disease name or Healthy",
    "confidence": 85,
    "treatment": "detailed treatment steps",
    "preventative": "preventative measures"
}`;

        const bedrockPayload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 2000,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: "image/jpeg",
                                data: image
                            }
                        },
                        {
                            type: "text",
                            text: prompt
                        }
                    ]
                }
            ]
        };

        const bedrockCommand = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(bedrockPayload)
        });

        const bedrockResponse = await bedrockClient.send(bedrockCommand);
        const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
        
        // Extract JSON from Claude's response
        const resultText = responseBody.content[0].text;
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
            disease: "Analysis Error",
            confidence: 0,
            treatment: "Unable to analyze image",
            preventative: "Please try again with a clearer image"
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
        console.error('Disease Detection Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Disease detection failed',
                message: error.message
            })
        };
    }
};
