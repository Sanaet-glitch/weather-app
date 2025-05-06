# Laravel Backend API for Weather App

This project is a Laravel API that will serve weather data to the Next.js frontend.

**Key Requirements:**
- Use the latest version of Laravel.
- Implement as an API only; no Blade views are needed.
- The API should fetch weather data from the OpenWeatherMap API (https://openweathermap.org/api).
- An API key for OpenWeatherMap will be required. This should be configurable, ideally via the `.env` file.
- The API endpoint should be open access (no authentication/authorization needed for this demo).
- Feel free to use any HTTP client for making requests to the OpenWeatherMap API (e.g., Laravel's built-in HTTP client, Guzzle).
- Ensure code is type-safe where possible (e.g., using PHP type hinting, PHPDoc blocks).
- Write clear and concise comments for all public API methods and complex logic.
- Adhere to Laravel best practices and coding standards.

**API Endpoint(s):**
- A primary endpoint will be needed to fetch weather data. This endpoint will likely accept parameters such as city name or coordinates.
- The response format should be JSON and provide the necessary data for the frontend to display, as per the wireframe: https://docs.google.com/document/d/1b2c0PGxCRV34K06jz_D_OGpPKPR7CrVByB8OYmL33xY/edit?tab=t.0

**Environment Variables:**
- `OPENWEATHERMAP_API_KEY`: Stores the API key for OpenWeatherMap.
