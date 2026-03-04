import { DiseaseResult, CropRec, YieldResult, AdvisoryResult, WeatherData } from "../types";

// AWS SDK v3 imports will be added after installation
// import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
// import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
// import { TranscribeClient } from "@aws-sdk/client-transcribe";
// import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configuration
const AWS_CONFIG = {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    apiGatewayUrl: import.meta.env.VITE_API_GATEWAY_URL || 'https://your-api-gateway-url.amazonaws.com/prod',
};

// Language mapping for AWS services
const getLangName = (code: string) => {
    const map: Record<string, string> = {
        en: 'English', hi: 'Hindi', or: 'Odia', bn: 'Bengali', 
        zh: 'Mandarin Chinese', es: 'Spanish', ru: 'Russian', 
        ja: 'Japanese', pt: 'Portuguese'
    };
    return map[code] || 'English';
};

// Helper function to call AWS Lambda via API Gateway
const callLambdaFunction = async (endpoint: string, payload: any) => {
    try {
        const response = await fetch(`${AWS_CONFIG.apiGatewayUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('cognito_token') || ''}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Lambda call failed for ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Disease Detection using Amazon Bedrock (Claude 3 with Vision) + Rekognition
 * Lambda Function: /disease-detection
 */
export const analyzeCropDisease = async (base64Image: string, language: string): Promise<DiseaseResult> => {
    try {
        const langName = getLangName(language);
        
        const response = await callLambdaFunction('/disease-detection', {
            image: base64Image,
            language: langName
        });

        return {
            disease: response.disease || 'Unknown',
            confidence: response.confidence || 0,
            treatment: response.treatment || 'No treatment available',
            preventative: response.preventative || 'No preventative measures available'
        };
    } catch (error) {
        console.error("AWS Disease Detection Error:", error);
        throw new Error("Failed to analyze crop disease. Please try again.");
    }
};

/**
 * Crop Recommendations using Amazon Bedrock (Claude 3)
 * Lambda Function: /crop-recommendations
 */
export const getCropRecommendations = async (
    soil: string, 
    season: string, 
    location: string, 
    language: string
): Promise<CropRec[]> => {
    try {
        const langName = getLangName(language);
        
        const response = await callLambdaFunction('/crop-recommendations', {
            soil,
            season,
            location,
            language: langName
        });

        return response.recommendations || [];
    } catch (error) {
        console.error("AWS Crop Recommendation Error:", error);
        return [];
    }
};

/**
 * Chat with Bhumi using Amazon Bedrock (Claude 3)
 * Lambda Function: /chat
 */
export const chatWithBhumi = async (
    history: {role: string, parts: {text: string}[]}[], 
    message: string, 
    language: string
): Promise<string> => {
    try {
        const langName = getLangName(language);
        
        // Convert history format to Claude format
        const claudeHistory = history.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.parts[0].text
        }));

        const response = await callLambdaFunction('/chat', {
            history: claudeHistory,
            message,
            language: langName
        });

        return response.reply || "I couldn't understand that.";
    } catch (error) {
        console.error("AWS Chat Error:", error);
        throw error;
    }
};

/**
 * Voice Agent Chat using Amazon Bedrock (Claude 3 Haiku for speed)
 * Lambda Function: /voice-chat
 */
export const voiceAgentChat = async (message: string): Promise<string> => {
    try {
        const response = await callLambdaFunction('/voice-chat', {
            message
        });

        return response.reply || "I am having trouble hearing you clearly.";
    } catch (error) {
        console.error("AWS Voice Chat Error:", error);
        return "I am having trouble hearing you clearly.";
    }
};

/**
 * Yield Prediction using Amazon Bedrock (Claude 3) + SageMaker (optional)
 * Lambda Function: /yield-prediction
 */
export const getYieldPrediction = async (data: any, language: string): Promise<YieldResult> => {
    try {
        const langName = getLangName(language);
        
        const response = await callLambdaFunction('/yield-prediction', {
            ...data,
            language: langName
        });

        return {
            predicted_yield: response.predicted_yield || '0',
            unit: response.unit || 'Tonnes',
            confidence: response.confidence || 0,
            influencing_factors: response.influencing_factors || [],
            suggestions: response.suggestions || 'No suggestions available'
        };
    } catch (error) {
        console.error("AWS Yield Prediction Error:", error);
        throw error;
    }
};

/**
 * Smart Advisory using Amazon Bedrock (Claude 3)
 * Lambda Function: /smart-advisory
 */
export const getSmartAdvisory = async (data: any, language: string): Promise<AdvisoryResult> => {
    try {
        const langName = getLangName(language);
        
        const response = await callLambdaFunction('/smart-advisory', {
            ...data,
            language: langName
        });

        return {
            irrigation: response.irrigation || "N/A",
            fertilizer: response.fertilizer || "N/A",
            pesticides: response.pesticides || "N/A"
        };
    } catch (error) {
        console.error("AWS Smart Advisory Error:", error);
        return { irrigation: "N/A", fertilizer: "N/A", pesticides: "N/A" };
    }
};

/**
 * Weather Forecast using Amazon Bedrock + External Weather API
 * Lambda Function: /weather-forecast
 */
export const getWeatherForecast = async (location: string, language: string): Promise<WeatherData> => {
    try {
        const langName = getLangName(language);
        
        const response = await callLambdaFunction('/weather-forecast', {
            location,
            language: langName
        });

        return {
            temp: response.temp || 0,
            humidity: response.humidity || 0,
            windSpeed: response.windSpeed || 0,
            condition: response.condition || 'Unknown',
            location: response.location || location,
            description: response.description || '',
            forecast: response.forecast || [],
            advisory: response.advisory || '',
            sourceUrls: response.sourceUrls || []
        };
    } catch (error) {
        console.error("AWS Weather Error:", error);
        throw error;
    }
};

/**
 * Analytics Insight using Amazon Bedrock (Claude 3)
 * Lambda Function: /analytics-insight
 */
export const getAnalyticsInsight = async (data: any, language: string): Promise<string> => {
    try {
        const langName = getLangName(language);
        
        const response = await callLambdaFunction('/analytics-insight', {
            data,
            language: langName
        });

        return response.insight || "Analysis unavailable.";
    } catch (error) {
        console.error("AWS Analytics Error:", error);
        return "Could not generate analysis.";
    }
};

/**
 * Voice Transcription using Amazon Transcribe
 * This can be called directly from frontend or via Lambda
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
        // Convert blob to base64
        const reader = new FileReader();
        const base64Audio = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(audioBlob);
        });

        const response = await callLambdaFunction('/transcribe', {
            audio: base64Audio.split(',')[1]
        });

        return response.transcript || '';
    } catch (error) {
        console.error("AWS Transcribe Error:", error);
        throw error;
    }
};

/**
 * Text-to-Speech using Amazon Polly
 * Returns audio URL or base64
 */
export const synthesizeSpeech = async (text: string, language: string): Promise<string> => {
    try {
        const response = await callLambdaFunction('/synthesize-speech', {
            text,
            language
        });

        return response.audioUrl || response.audioBase64 || '';
    } catch (error) {
        console.error("AWS Polly Error:", error);
        throw error;
    }
};
