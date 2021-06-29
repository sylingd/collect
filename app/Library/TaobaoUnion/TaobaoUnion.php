<?php

namespace App\Library\TaobaoUnion;

use App\Library\Utils;
use Sy\App;

const TB_URL = 'https://api.taobao.com/router/rest?';

class TaobaoUnion {
  private $key;
  private $secret;

  public function __construct() {
    $this->key = App::$config->get('tb_union.key');
    $this->secret = App::$config->get('tb_union.secret');
  }

  private function request($method, &$param) {
    $param['method'] = $method;
    // 进行签名
    $param['app_key'] = $this->key;
    $param['timestamp'] = date('Y-m-d H:i:s');
    $param['sign_method'] = 'md5';
    $param['v'] = '2.0';
    $param['format'] = 'json';
    $param['simplify'] = 'true';
    ksort($param);
    // $param['360buy_param_json'] = json_encode($data);
    $to_sign = '';
    foreach ($param as $key => $value) {
      $to_sign .= $key . $value;
    }
    $param['sign'] = strtoupper(md5($this->secret . $to_sign . $this->secret));
    // 实际请求
    $result = Utils::fetchUrl(TB_URL . http_build_query($param), [
      'json' => true
    ]);

    if (isset($result['error_response'])) {
      throw new TaobaoException($result['error_response']['sub_msg'], $result['error_response']['sub_code']);
    }

    return $result['data'];
  }

  public function queryOrder(&$param) {
    if (!isset($param['query_type'])) {
      $param['query_type'] = 1;
    }
    if (!isset($param['page_size'])) {
      $param['page_size'] = 100;
    }
    if (!isset($param['page_no'])) {
      $param['page_no'] = 1;
    }

    return $this->request('taobao.tbk.order.details.get', $param)['results'];
  }
}
