<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->get('admin', 'Admin::index');
$routes->get('recruter', 'Recruter::index');

$routes->get('index.html', 'Home::index');

