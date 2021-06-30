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
use Sy\DI\Container;
use App\Library\TaobaoUnion\TaobaoUnion;

class Taobao {
  public static function enable() {
    return !empty(App::$config->get('taobao_api'));
  }

  protected static function convertOrder($order) {
    $rebate = floatval($order['pub_share_fee']);
    return [
      'status' => intval($order['tk_status']), // 状态码，13为无效订单
      'pay' => $order['pay_price'], // 付款金额
      'expect_rebate' => $rebate > 0 ? $rebate : floatval($order['pub_share_pre_fee']), // 预估收入
      'rebate' => $rebate, // 实际收入
      'charge' => floatval($order['alimama_share_fee']), // 手续费
      'create_time' => $order['tk_create_time'], // 订单创建时间
    ];
  }

  public static function isValidStatus($status) {
    return $status !== 13;
  }

  public static function getRemoteOrder($orderId, $time, $timeOffset = 600) {
    $union = Container::getInstance()->get(TaobaoUnion::class);

    try {
      $param = [
        'start_time' => date('Y-m-d H:i:s', $time - $timeOffset),
        'end_time' => date('Y-m-d H:i:s', $time + $timeOffset),
      ];
      $orders = $union->queryOrder($param);
    } catch (\Exception $e) {
      return null;
    }

    // 同一个父ID下可能有很多个子订单
    $orders = array_filter($orders, function ($item) use ($orderId) {
      return $item['trade_parent_id'] === $orderId;
    });

    if (count($orders) === 0) {
      return null;
    }

    if (count($orders) === 1) {
      return self::convertOrder($orders[0]);
    }

    $orders = array_map([self::class, 'convertOrder'], $orders);
    $total = [
      'status' => 13,
      'pay' => 0,
      'expect_rebate' => 0,
      'rebate' => 0,
      'charge' => 0,
      'create_time' => $orders[0]['create_time'],
    ];
    foreach ($orders as $order) {
      if (!self::isValidStatus($order['status'])) {
        continue;
      }
      $total['status'] = $order['status'];
      $total['pay'] += $order['pay'];
      $total['expect_rebate'] += $order['expect_rebate'];
      $total['rebate'] += $order['rebate'];
      $total['charge'] += $order['charge'];
    }
    return $total;
  }

  public static function getUrl($url) {
    $apiPrefix = App::$config->get('taobao_api');
    if (empty($apiPrefix)) {
      return '暂不支持淘宝链接转换，请联系管理员';
    }

    $api = App::$config->get('taobao_api')  . '/convert?url=' . urlencode($url);
    $result = Utils::fetchUrl($api, [
      'json' => true
    ]);

    if (isset($result['errorCode']) && $result['errorCode'] !== '200') {
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
