<?php
/**
 * User Inject
 * 
 * @author ShuangYa
 * @package Plugin
 * @category Configutation
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */
namespace App\Plugin;

use Sy\App;
use Sy\Plugin;
use Sy\Http\Request;
use App\Library\Utils;
use App\Library\ApiCrypto;

class ApiInterceptor {
	public function register() {
		Plugin::register('beforeDispatch', [$this, 'handle']);
	}

	public function handle(Request $request) {
		if (strtolower($request->module) === "api") {
			header('Content-Type: application/json; charset=UTF-8');
		}
	}
}