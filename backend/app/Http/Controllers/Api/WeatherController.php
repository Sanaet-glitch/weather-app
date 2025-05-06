<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // Import Laravel's HTTP client
use Illuminate\Support\Facades\Log; // Import Log facade for error logging

class WeatherController extends Controller
{
    /**
     * Fetch weather data for a given city.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWeather(Request $request)
    {
        // Validate the request to ensure 'city' parameter is present
        $validated = $request->validate([
            'city' => 'required|string|max:255',
        ]);

        $city = $validated['city'];
        $apiKey = env('OPENWEATHERMAP_API_KEY');

        if (!$apiKey) {
            Log::error('OpenWeatherMap API key is not configured.');
            return response()->json(['error' => 'Server configuration error: API key missing.'], 500);
        }

        try {
            $response = Http::timeout(10)->get('https://api.openweathermap.org/data/2.5/weather', [
                'q' => $city,
                'appid' => $apiKey,
                'units' => 'metric', // Get temperature in Celsius
            ]);

            if ($response->failed()) {
                // Log the error details from OpenWeatherMap
                Log::error('OpenWeatherMap API request failed.', [
                    'city' => $city,
                    'status' => $response->status(),
                    'response_body' => $response->body(),
                ]);

                if ($response->status() == 401) {
                    return response()->json(['error' => 'Invalid API key for OpenWeatherMap.'], 500);
                } elseif ($response->status() == 404) {
                    return response()->json(['error' => 'City not found.'], 404);
                } else {
                    return response()->json(['error' => 'Failed to fetch weather data.'], $response->status());
                }
            }

            // Return the successful response from OpenWeatherMap
            return response()->json($response->json());

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('ConnectionException while contacting OpenWeatherMap API.', [
                'city' => $city,
                'error_message' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Could not connect to the weather service.'], 503); // Service Unavailable
        } catch (\Exception $e) {
            Log::error('An unexpected error occurred while fetching weather data.', [
                'city' => $city,
                'error_message' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
