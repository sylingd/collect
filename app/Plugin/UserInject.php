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

use App\Library\Utils;
use Sy\Plugin;
use Sy\Http\Request;
use Sy\Http\Cookie;
use App\Service\User;

class UserInject {
	private $user;
	public function __construct(User $user) {
		$this->user = $user;
	}

	public function register() {
		Plugin::register('beforeDispatch', [$this, 'handle']);
	}

	public function handle(Request $request) {
		$request->user = null;
		if (isset($request->server['HTTP_X_AUTH'])) {
			list($uid, $password) = explode('|', $request->server['HTTP_X_AUTH']);
			if ($uid && $password && is_numeric($uid)) {
				$userInfo = $this->user->get($uid);
				if (password_verify($password, $userInfo['password'])) {
					$request->user = $userInfo;
				}
			}
		}
		if (strtolower($request->module) === "api" && strtolower($request->controller) !== "user" && strtolower($request->controller) !== "rebate") {
			if ($request->user === null) {
				echo Utils::getResult([
					'error' => '登录失败'
				]);
				return false;
			}
			if (strtolower($request->controller) === "admin" && $request->user['id'] != 1) {
				echo Utils::getResult([
					'error' => '您不是管理员，无法进行此操作'
				]);
				return false;
			}
		}
	}
}
