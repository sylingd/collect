<?php
/**
 * 用户
 * 
 * @author ShuangYa
 * @package Example
 * @category Controller
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */
namespace App\Module\Api\Controller;

use App\Library\Utils;
use Sy\ControllerAbstract;
use Sy\Http\Request;
use App\Service\User as UserService;

class User extends ControllerAbstract {
	private $user;
	public function __construct(UserService $user) {
		$this->user = $user;
	}

	public function loginAction(Request $request) {
		$user = $request->post['user'];
		if (Utils::isValidUserName($user) !== 0) {
			return Utils::getResult([
				'error' => '用户不存在'
			]);
		}
		$userInfo = $this->user->get(['name' => $user]);
		$password = $request->post['password'];
		if (!$userInfo) {
			return Utils::getResult([
				'error' => '用户不存在'
			]);
		}
		if (!password_verify($password, $userInfo['password'])) {
			return Utils::getResult([
				'error' => '密码错误'
			]);
		}
		return Utils::getResult([
			'id' => $userInfo['id'],
			'isAdmin' => $userInfo['id'] == 1
		]);
	}

	public function registerAction(Request $request) {
		$user = $request->post['user'];
		$password = $request->post['password'];
		// 检查用户名
		switch (Utils::isValidUserName($user)) {
			case 1:
			case 2:
				return Utils::getResult([
					'error' => '仅允许4-16位用户名'
				]);
			case 3:
				return Utils::getResult([
					'error' => '用户名只能是字母、数字、下划线组成'
				]);
		}
		// 检查是否已经存在
		$userInfo = $this->user->get(['name' => $user]);
		if ($userInfo) {
			return Utils::getResult([
				'error' => '用户已存在'
			]);
		}
		$newPassword = password_hash($password, PASSWORD_DEFAULT);
		$id = $this->user->add([
			'name' => $user,
			'password' => $newPassword,
			'qrcode' => '',
		]);
		return Utils::getResult([
			'id' => $id,
			'isAdmin' => $id == 1
		]);
	}
}