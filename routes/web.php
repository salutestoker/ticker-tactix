<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\MarketController as AdminMarketController;
use App\Http\Controllers\Admin\ModuleController as AdminModuleController;
use App\Http\Controllers\Admin\NewsletterDeliveryController as AdminNewsletterDeliveryController;
use App\Http\Controllers\Admin\NewsletterGeneratorController as AdminNewsletterGeneratorController;
use App\Http\Controllers\Admin\PlaybookController as AdminPlaybookController;
use App\Http\Controllers\Admin\TraderTypeController as AdminTraderTypeController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\NewsletterSubscriptionPortalController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PlaybookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\SubscriptionWelcomePortalController;
use App\Http\Controllers\TraderTypeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::redirect('/about', '/system', 301);
Route::redirect('/methodology', '/system', 301);
Route::get('/system', [PageController::class, 'system'])->name('system');
Route::get('/trader-types', [PageController::class, 'traderTypes'])->name('trader-types');
Route::get('/trader-types/{traderType:slug}', [TraderTypeController::class, 'show'])->name('trader-types.show');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/welcome', [PageController::class, 'welcome'])->name('welcome');
Route::get('/modules', [ModuleController::class, 'index'])->name('modules.index');
Route::get('/modules/{module:slug}', [ModuleController::class, 'show'])->name('modules.show');
Route::get('/playbooks', [PlaybookController::class, 'index'])->name('playbooks.index');
Route::get('/playbooks/{playbook:slug}', [PlaybookController::class, 'show'])->name('playbooks.show');
Route::get('/newsletter-subscription/manage/{delivery}', NewsletterSubscriptionPortalController::class)
    ->middleware('signed')
    ->name('newsletter-deliveries.portal');
Route::get('/subscription/manage/{event}', SubscriptionWelcomePortalController::class)
    ->middleware('signed')
    ->name('subscription-welcome.portal');
Route::post('/webhooks/stripe', StripeWebhookController::class)->name('stripe.webhooks');
Route::redirect('/risk-disclaimer', '/financial-disclaimer');
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
        Route::get('customers', AdminCustomerController::class)->name('customers.index');
        Route::get('components', fn () => Inertia::render('Admin/Components/Index'))->name('components.index');
        Route::get('newsletter-generator', AdminNewsletterGeneratorController::class)->name('newsletter-generator');
        Route::post('newsletter-generator', [AdminNewsletterGeneratorController::class, 'store'])->name('newsletter-generator.store');
        Route::post('newsletter-generator/deliveries', [AdminNewsletterDeliveryController::class, 'store'])->name('newsletter-generator.deliveries.store');
        Route::post('newsletter-generator/deliveries/send-now', [AdminNewsletterDeliveryController::class, 'sendGeneratedNow'])->name('newsletter-generator.deliveries.send-generated-now');
        Route::post('newsletter-generator/deliveries/{delivery}/send-now', [AdminNewsletterDeliveryController::class, 'sendNow'])->name('newsletter-generator.deliveries.send-now');
        Route::delete('newsletter-generator/deliveries/{delivery}', [AdminNewsletterDeliveryController::class, 'destroy'])->name('newsletter-generator.deliveries.destroy');
        Route::post('newsletter-generator/test-email', [AdminNewsletterDeliveryController::class, 'test'])->name('newsletter-generator.test-email');
        Route::get('newsletter-generator/recipient-count', [AdminNewsletterDeliveryController::class, 'recipientCount'])->name('newsletter-generator.recipient-count');
        Route::resource('modules', AdminModuleController::class)->except(['show']);
        Route::post('modules/{module}/purchase-email/test', [AdminModuleController::class, 'sendPurchaseEmailTest'])->name('modules.purchase-email.test');
        Route::post('modules/reorder', [AdminModuleController::class, 'reorder'])->name('modules.reorder');
        Route::resource('playbooks', AdminPlaybookController::class)->except(['show']);
        Route::post('playbooks/{playbook}/purchase-email/test', [AdminPlaybookController::class, 'sendPurchaseEmailTest'])->name('playbooks.purchase-email.test');
        Route::post('playbooks/reorder', [AdminPlaybookController::class, 'reorder'])->name('playbooks.reorder');
        Route::resource('markets', AdminMarketController::class)->except(['show']);
        Route::resource('trader-types', AdminTraderTypeController::class)->except(['show']);
        Route::resource('users', AdminUserController::class)->only(['index', 'create', 'store']);
    });

require __DIR__.'/auth.php';
