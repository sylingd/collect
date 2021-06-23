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
namespace App\Module\Index\Controller;

use Sy\ControllerAbstract;
use Sy\Http\Request;

class Index extends ControllerAbstract {
	public function indexAction(Request $request) {
		$this->display('Index/Index');
	}
}