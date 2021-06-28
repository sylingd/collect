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
}
