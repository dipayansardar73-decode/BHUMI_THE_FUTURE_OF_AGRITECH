import { User } from '../types';

// AWS Cognito Configuration
const COGNITO_CONFIG = {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || 'your-client-id',
    identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || 'us-east-1:xxxx-xxxx-xxxx',
};

// AWS SDK v3 imports (to be installed)
// import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

// Storage keys
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'cognito_access_token',
    ID_TOKEN: 'cognito_id_token',
    REFRESH_TOKEN: 'cognito_refresh_token',
    USER_DATA: 'cognito_user_data',
};

/**
 * AWS Cognito Authentication Service
 * Replaces Firebase Auth
 */
export const cognitoAuth = {
    /**
     * Sign up new user
     */
    async signup(userData: User, password: string): Promise<User> {
        try {
            // Call API Gateway endpoint for signup
            const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    password,
                    name: userData.name,
                    attributes: {
                        'custom:location': userData.location || '',
                        'custom:farmSize': userData.farmSize || '',
                        'custom:soilType': userData.soilType || '',
                        'custom:mainCrop': userData.mainCrop || '',
                        'custom:irrigationSource': userData.irrigationSource || '',
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Signup failed');
            }

            const data = await response.json();
            
            // Store tokens
            if (data.tokens) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.tokens.accessToken);
                localStorage.setItem(STORAGE_KEYS.ID_TOKEN, data.tokens.idToken);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.tokens.refreshToken);
            }

            // Store user data
            const user: User = {
                email: userData.email,
                name: userData.name,
                location: userData.location,
                farmSize: userData.farmSize,
                soilType: userData.soilType,
                mainCrop: userData.mainCrop,
                irrigationSource: userData.irrigationSource,
                memberSince: new Date().getFullYear().toString(),
            };
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

            return user;
        } catch (error) {
            console.error('Cognito Signup Error:', error);
            throw error;
        }
    },

    /**
     * Login existing user
     */
    async login(email: string, password: string): Promise<User> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();

            // Store tokens
            if (data.tokens) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.tokens.accessToken);
                localStorage.setItem(STORAGE_KEYS.ID_TOKEN, data.tokens.idToken);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.tokens.refreshToken);
            }

            // Store user data
            const user: User = data.user;
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

            return user;
        } catch (error) {
            console.error('Cognito Login Error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            // Call API Gateway to invalidate tokens
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            if (accessToken) {
                await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.ID_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
    },

    /**
     * Get current authenticated user
     */
    async getCurrentUser(): Promise<User | null> {
        try {
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            if (!accessToken) return null;

            // Try to get from local storage first
            const cachedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
            if (cachedUser) {
                return JSON.parse(cachedUser);
            }

            // Fetch from API
            const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/user`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                // Token might be expired
                await this.logout();
                return null;
            }

            const user = await response.json();
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },

    /**
     * Update user profile
     */
    async updateProfile(userData: User): Promise<User> {
        try {
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            if (!accessToken) throw new Error('Not authenticated');

            const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Profile update failed');
            }

            const updatedUser = await response.json();
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshToken) return false;

            const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) return false;

            const data = await response.json();
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
            localStorage.setItem(STORAGE_KEYS.ID_TOKEN, data.idToken);

            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    },

    /**
     * Get access token for API calls
     */
    getAccessToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
};
