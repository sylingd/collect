<?php

/**
 * Taobao
 * 
 * @author ShuangYa
 * @package Example
 * @category Library
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */

namespace App\Library;

use Sy\App;
use App\Library\TaobaoUnion\TaobaoUnion;

class Taobao {
  public static function getUrl($url) {
    $apiPrefix = App::$config->get('taobao_api');
    if (empty($apiPrefix)) {
      return '暂不支持淘宝链接转换，请联系管理员';
    }

    $api = App::$config->get('taobao_api')  . '/convert?url=' . urlencode($url);
    $result = Utils::fetchUrl($api, [
      'json' => true
    ]);

    if (isset($result['errorCode'])) {
      if ($result['errorCode'] === '403') {
        return '系统错误，请联系管理员处理';
      }
      return $result['errorMsg'];
    }

    return $result['data'];
  }

  public static function login() {
    $apiPrefix = App::$config->get('taobao_api');
    if (empty($apiPrefix)) {
      return '暂不支持淘宝链接转换，请联系管理员';
    }

    $api = App::$config->get('taobao_api')  . '/login';
    $result = Utils::fetchUrl($api, [
      'json' => true
    ]);

    return $result['data'];
  }

  public static function isOrderValid($orderId, $time) {
    static $union = null;
    if ($union === null) {
      $union = new TaobaoUnion();
    }
    try {
      $param = [
        'start_time' => date('Y-m-d H:i:s', $time - 600),
        'end_time' => date('Y-m-d H:i:s', $time + 600),
      ];
      $orders = $union->queryOrder($param);
    } catch (\Exception $e) {
      return null;
    }

    $order = null;
    foreach ($orders as $value) {
      if ($value['trade_parent_id'] === $orderId) {
        $order = $value;
        break;
      }
    }

    if (!$order) {
      return null;
    }

    return intval($order['tk_status']) !== 13;
  }

}
