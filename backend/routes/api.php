<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeatherController;

Route::get('/weather', [WeatherController::class, 'getWeather']);

// Optional: A route to get the authenticated user, if you were to add auth later
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
