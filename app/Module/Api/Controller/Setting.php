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
use App\Service\User;
use Sy\ControllerAbstract;
use Sy\Http\Request;

class Setting extends ControllerAbstract {
	private $user;
	public function __construct(User $user) {
		$this->user = $user;
	}

	public function loadAction(Request $request) {
		return Utils::getResult([
			'qrcode' => $request->user['qrcode']
		]);
	}

	public function saveAction(Request $request) {
		$this->user->set([
			'qrcode' => $request->post['qrcode']
		], $request->user['id']);
		
		return Utils::getResult();
	}

	public function infoAction(Request $request) {
		return Utils::getResult([
			'id' => $request->user['id'],
			'isAdmin' => $request->user['id'] == 1
		]);
	}
}