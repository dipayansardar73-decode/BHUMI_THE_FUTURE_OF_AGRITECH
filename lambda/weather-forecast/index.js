/**
 * AWS Lambda Function: Weather Forecast
 * Uses Amazon Bedrock + External Weather API (OpenWeatherMap/WeatherAPI)
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const https = require('https');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const WEATHER_API_KEY = process.env.WEATHER_API_KEY; // OpenWeatherMap or WeatherAPI key

// Helper function to fetch weather data
const fetchWeatherData = (location) => {
    return new Promise((resolve, reject) => {
        // Using OpenWeatherMap API (you can replace with any weather API)
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { location, language } = body;

        // Fetch real weather data
        const weatherData = await fetchWeatherData(location);

        if (weatherData.cod !== '200') {
            throw new Error('Weather data not found for location');
        }

        // Extract current weather
        const current = weatherData.list[0];
        const currentWeather = {
            temp: Math.round(current.main.temp),
            humidity: current.main.humidity,
            windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
            condition: current.weather[0].main,
            description: current.weather[0].description
        };

        // Extract 5-day forecast (one per day)
        const forecast = [];
        const seenDates = new Set();
        
        for (const item of weatherData.list) {
            const date = new Date(item.dt * 1000);
            const dateStr = date.toLocaleDateString();
            
            if (!seenDates.has(dateStr) && forecast.length < 5) {
                seenDates.add(dateStr);
                
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const condition = item.weather[0].main.toLowerCase();
                
                // Map condition to icon
                let icon = 'cloudy';
                if (condition.includes('clear') || condition.includes('sun')) icon = 'sunny';
                else if (condition.includes('rain')) icon = 'rain';
                else if (condition.includes('storm') || condition.includes('thunder')) icon = 'storm';
                else if (condition.includes('cloud')) icon = 'partly-cloudy';
                
                forecast.push({
                    day: dayName,
                    temp: Math.round(item.main.temp),
                    icon: icon,
                    condition: item.weather[0].main
                });
            }
        }

        // Use Claude to generate farming advisory based on weather
        const advisoryPrompt = `Based on the following weather conditions for ${location}, provide a brief farming advisory in ${language} language:

Current Weather:
- Temperature: ${currentWeather.temp}°C
- Humidity: ${currentWeather.humidity}%
- Wind Speed: ${currentWeather.windSpeed} km/h
- Condition: ${currentWeather.condition}

5-Day Forecast: ${forecast.map(f => `${f.day}: ${f.temp}°C, ${f.condition}`).join('; ')}

Provide practical advice for farmers (2-3 sentences) about:
- Irrigation needs
- Crop protection
- Optimal farming activities

Keep it concise and actionable.`;

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 500,
            messages: [
                {
                    role: "user",
                    content: advisoryPrompt
                }
            ]
        };

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0", // Using Haiku for speed
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const advisory = responseBody.content[0].text;

        // Compile final response
        const result = {
            temp: currentWeather.temp,
            humidity: currentWeather.humidity,
            windSpeed: currentWeather.windSpeed,
            condition: currentWeather.condition,
            location: weatherData.city.name,
            description: currentWeather.description,
            forecast: forecast,
            advisory: advisory,
            sourceUrls: ['https://openweathermap.org']
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
        console.error('Weather Forecast Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Weather forecast failed',
                message: error.message
            })
        };
    }
};
