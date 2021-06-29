<?php
$cfg = [
	'namespace' => 'App\\',
	'database' => 'mysql',
	'jd_cookie' => '/path/to/cookie',
	'taobao_api' => 'http://127.0.0.1:3000/',
	'jd_union' => [
		'key' => '',
		'secret' => ''
	],
	'tb_union' => [
		'key' => '',
		'secret' => ''
	],
	'template' => [
		'engine' => 'Sy\\Http\\Template',
		'auto' => false,
		'extension' => 'phtml'
	],
	'cache' => [
		'type' => 'redis'
	],
	'redis' => [
		'host' => 'localhost',
		'port' => 6379
	],
	'mysql' => [
		'host' => 'localhost',
		'port' => 3306,
		'user' => 'root',
		'password' => 'root',
		'database' => 'demo'
	],
	'modules' => ['Api'],
	'module' => 'Api',
	'charset' => 'UTF-8'
];
return [
	'product' => $cfg,
	'develop' => $cfg
];