<?php
/**
 * 配置
 * 
 * @author ShuangYa
 * @package Example
 * @category Configutation
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */
namespace App;

use App\Plugin\ApiInterceptor;
use App\Plugin\UserInject;

class Configuration {
	public function setPlugin(UserInject $user, ApiInterceptor $api) {
		$user->register();
		$api->register();
	}
}