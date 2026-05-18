<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ModuleController as AdminModuleController;
use App\Http\Controllers\Admin\PlaybookCategoryController as AdminPlaybookCategoryController;
use App\Http\Controllers\Admin\PlaybookController as AdminPlaybookController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PlaybookController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/modules', [ModuleController::class, 'index'])->name('modules.index');
Route::get('/modules/{module:slug}', [ModuleController::class, 'show'])->name('modules.show');
Route::get('/playbooks', [PlaybookController::class, 'index'])->name('playbooks.index');
Route::get('/playbooks/{playbook:slug}', [PlaybookController::class, 'show'])->name('playbooks.show');
Route::get('/{page}', [PageController::class, 'legal'])
    ->whereIn('page', ['terms-of-service', 'membership-agreement', 'privacy-policy', 'financial-disclaimer'])
    ->name('legal.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/', AdminDashboardController::class)->name('dashboard');
        Route::resource('modules', AdminModuleController::class)->except(['show']);
        Route::resource('playbooks', AdminPlaybookController::class)->except(['show']);
        Route::resource('playbook-categories', AdminPlaybookCategoryController::class)->except(['show']);
    });

require __DIR__.'/auth.php';
