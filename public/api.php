<?php
/**
 * 首页
 * 
 * @author ShuangYa
 * @package Example
 * @category Public
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */
error_reporting(E_ALL &~ E_NOTICE);
define('IS_DEV', file_exists(__DIR__ . '/.dev'));
define('PROJECT_PATH', realpath(__DIR__ . '/..') . '/');
define('APP_PATH', PROJECT_PATH . 'app/');
define('APP_ENV', IS_DEV ? 'develop' : 'product');
define('PUBLIC_PATH', __DIR__ . '/');
require(PROJECT_PATH . '/vendor/autoload.php');

Sy\App::create(require(APP_PATH . 'Config.php'));
