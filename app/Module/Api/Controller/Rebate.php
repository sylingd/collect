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
  public function convertAction(Request $request) {
    $platform = $request->get['platform'];
    $id = $request->get['id'];
    $result = '该平台暂不支持';
    if ($platform === 'jd') {
      $result = Jd::getUrl($id);
    }
    if ($platform === 'taobao') {
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
