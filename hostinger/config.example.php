<?php
/* Copy OUTSIDE public_html to ../almazara-private/config.php. Never share filled credentials. */
return [
    'base_url' => 'https://TU-DOMINIO.ch', // No trailing slash; a subdirectory is supported.
    'app_key' => '', // Generate: php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
    'db' => ['dsn' => 'mysql:host=localhost;dbname=TU_BASE;charset=utf8mb4', 'user' => '', 'password' => ''],
    'newsletter_enabled' => false,
    'contact_enabled' => false,
    'contact_to' => 'almazara.olive@gmail.com',
    'smtp' => ['host' => 'smtp.hostinger.com', 'port' => 465, 'encryption' => 'ssl',
        'user' => '', 'password' => '', 'from' => '', 'from_name' => 'ALMAZARA'],
    'payments_enabled' => false,
    'stripe_secret_key' => '', // sk_test_... first. Change to sk_live_... ONLY after acceptance tests.
    'stripe_webhook_secret' => '', // whsec_... for this environment's snapshot endpoint.
    'shipping_ch_cents' => null, // Confirm a flat Swiss shipping rate, in centimes, before enabling.
    'prices_confirmed' => ['jamon-iberico' => false, 'paleta-iberica' => false],
    'sale_terms_confirmed' => false, // Confirm all-in product prices, taxes, stock, returns and delivery.
];
