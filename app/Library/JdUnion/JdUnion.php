<?php

namespace App\Library\JdUnion;

use App\Library\Utils;
use Sy\App;

const JD_URL = 'https://api.jd.com/routerjson?';

class JdUnion {
  private $key;
  private $secret;

  public function __construct() {
    $this->key = App::$config->get('jd_union.key');
    $this->secret = App::$config->get('jd_union.secret');
  }

  private function request($method, $data) {
    $param = [];
    $param['method'] = $method;
    $param['360buy_param_json'] = json_encode($data);
    // 进行签名
    $param['app_key'] = $this->key;
    $param['timestamp'] = date('Y-m-d H:i:s');
    $param['format'] = 'json';
    $param['v'] = '1.0';
    $param['sign_method'] = 'md5';
    ksort($param);
    $to_sign = '';
    foreach ($param as $key => $value) {
      $to_sign .= $key . $value;
    }
    $param['sign'] = strtoupper(md5($this->secret . $to_sign . $this->secret));
    // 实际请求
    $result = Utils::fetchUrl(JD_URL . http_build_query($param), [
      'json' => true
    ]);

    if (isset($result['error_response'])) {
      throw new JdException($result['error_response']['zh_desc'], $result['error_response']['code']);
    }

    $response = current($result)['queryResult'];
    if (is_string($response)) {
      $response = json_decode($response, true);
    }

    if ($response['code'] !== 200) {
      throw new JdException($response['message'], $response['code']);
    }

    return $response['data'];
  }

  public function queryOrder(&$param) {
    if (!isset($param['pageIndex'])) {
      $param['pageIndex'] = 1;
    }
    if (!isset($param['pageSize'])) {
      $param['pageSize'] = 100;
    }
    if (!isset($param['type'])) {
      $param['type'] = 1;
    }

    $result = $this->request('jd.union.open.order.row.query', [
      'orderReq' => $param
    ]);

    if (!is_array($result)) {
      return [];
    }
    return $result;
  }
}
