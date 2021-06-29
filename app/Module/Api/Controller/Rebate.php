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

use App\Library\Jd;
use App\Library\Taobao;
use App\Library\Utils;
use Sy\ControllerAbstract;
use Sy\Http\Request;

class Rebate extends ControllerAbstract {
  public function platformAction(Request $request) {
    $result = [];
    if (Jd::enable()) {
      $result[] = 2;
    }
    if (Taobao::enable()) {
      $result[] = 1;
    }
    return Utils::getResult($result);
  }

  public function convertAction(Request $request) {
    $platform = intval($request->get['platform']);
    $id = $request->get['id'];
    $result = '该平台暂不支持';
    if ($platform === 2) {
      $result = Jd::getUrl($id);
    }
    if ($platform === 1) {
      $result = Taobao::getUrl($id);
    }
    if (is_string($result)) {
      return Utils::getResult([
        'error' => $result
      ]);
    }
    return Utils::getResult($result);
  }
}
