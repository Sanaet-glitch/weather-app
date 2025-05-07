<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'], // Apply CORS to all routes starting with 'api/'

    'allowed_methods' => ['*'], // Allow all common HTTP methods (GET, POST, PUT, DELETE, etc.)

    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')], // Allow your Next.js frontend

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Allow all headers

    'exposed_headers' => [],

    'max_age' => 0, // Optional: Set how long the results of a preflight request can be cached

    'supports_credentials' => false, // Set to true if you plan to use cookies or sessions across domains

];
