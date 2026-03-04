/**
 * Service Layer Switcher
 * Toggle between Gemini and AWS services
 */

// ========================================
// CONFIGURATION: Choose your backend
// ========================================

const USE_AWS = true; // Set to true for AWS, false for Gemini

// ========================================
// Import both service implementations
// ========================================

import * as awsService from './awsService';
import * as geminiService from './geminiService';

// ========================================
// Choose the active service based on flag
// ========================================

const activeService = USE_AWS ? awsService : geminiService;

// ========================================
// Re-export all functions from the active service
// ========================================

export const analyzeCropDisease = activeService.analyzeCropDisease;
export const getCropRecommendations = activeService.getCropRecommendations;
export const chatWithBhumi = activeService.chatWithBhumi;
export const voiceAgentChat = activeService.voiceAgentChat;
export const getYieldPrediction = activeService.getYieldPrediction;
export const getSmartAdvisory = activeService.getSmartAdvisory;
export const getWeatherForecast = activeService.getWeatherForecast;
export const getAnalyticsInsight = activeService.getAnalyticsInsight;

// ========================================
// Log which service is active
// ========================================

if (USE_AWS) {
    console.log('🔵 Using AWS Services (Bedrock + Rekognition)');
} else {
    console.log('🟢 Using Google Gemini Services');
}

// ========================================
// Authentication Service Switcher
// ========================================

export { cognitoAuth as auth } from './awsCognito';
// Or use: export { api as auth } from './api'; // for mock auth
