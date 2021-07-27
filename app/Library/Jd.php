<?php

/**
 * JD
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
use App\Library\JdUnion\JdUnion;

class Jd {
  public static function enable() {
    return !empty(App::$config->get('jd_cookie'));
  }

  public static function getCookie() {
    static $ck = '';

    if (empty($ck)) {
      $ck = trim(file_get_contents(App::$config->get('jd_cookie')));
    }

    return $ck;
  }

  protected static function convertOrder($order) {
    $rebate = floatval($order['actualFee']);
    return [
      'status' => intval($order['validCode']), // 状态码，非15/16/17为无效订单
      'pay' => $order['estimateCosPrice'], // 付款金额
      'expect_rebate' => $rebate > 0 ? $rebate : floatval($order['estimateFee']), // 预估收入
      'rebate' => $rebate, // 实际收入
      'charge' => 0, // 手续费
      'create_time' => $order['orderTime'], // 订单创建时间
    ];
  }

  public static function isValidStatus($status) {
    return in_array($status, [15, 16, 17], true);
  }

  public static function getRemoteOrder($orderId, $time, $timeOffset = 600) {
    $union = Container::getInstance()->get(JdUnion::class);

    try {
      $param = [
        'startTime' => date('Y-m-d H:i:s', $time - $timeOffset),
        'endTime' => date('Y-m-d H:i:s', $time + $timeOffset),
      ];
      $orders = $union->queryOrder($param);
    } catch (\Exception $e) {
      return null;
    }

    // 同一个父ID下可能有很多个子订单
    $orders = array_values(array_filter($orders, function ($item) use ($orderId) {
      return $item['orderId'] == $orderId;
    }));

    if (count($orders) === 0) {
      return null;
    }

    if (count($orders) === 1) {
      return self::convertOrder($orders[0]);
    }

    $orders = array_map([self::class, 'convertOrder'], $orders);
    $total = [
      'status' => 0,
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
    }
    return $total;
  }

  public static function getUrl($id) {
    $search = Utils::fetchUrl('https://api.m.jd.com/?' . http_build_query([
      'functionId' => 'unionSearch',
      'client' => 'apple',
      'clientVersion' => '3.9.2',
      'appid' => 'u_jfapp',
      'loginType' => 2,
      't' => time(),
      'body' => json_encode([
        'funName' => 'search',
        'version' => 'v2',
        'source' => 30110,
        'param' => [
          'skuIds' => [$id]
        ],
        'isShowDetail' => 1,
        'isNeedVideo' => 1,
      ])
    ]), [
      'json' => true,
      'cookie' => self::getCookie(),
      'header' => [
        'Content-type: application/json;charset=UTF-8',
        'Origin: https://jingfenapp.jd.com',
        'Referer: https://jingfenapp.jd.com/pages/search'
      ]
    ]);

    if ($search['code'] === 420) {
      return '系统错误，请联系管理员处理';
    }

    $good = null;
    if (!isset($search['data']) || !isset($search['data']['skuPage']) || count($search['data']['skuPage']['result']) === 0) {
      return '未找到该商品，可能该商品不支持返利';
    }

    // 尝试拉一下GWD的API，看看有没有优惠券
    // $gwd = Utils::fetchUrl('https://m.gwdang.com/trend/data_new?' . http_build_query([
    //   'opt' => 'product',
    //   'dp_id' => $id . '-3',
    //   'search_url' => 'https://item.jd.com/' . $id . '.html',
    //   'period' => 180,
    //   'from' => 'wx_1'
    // ]), [
    //   'json' => true,
    //   'timeout' => 3
    // ]);
    // if (is_array($gwd) && isset($gwd['data']) && isset($gwd['data']['dp_info']) && isset($gwd['data']['dp_info']['coupon'])) {
    //   $url = $gwd['data']['dp_info']['coupon']['url'];
    //   $discount = intval($gwd['data']['dp_info']['coupon']['amount']);
    //   if (!isset($good['couponDiscount']) || $good['couponDiscount'] < $discount) {
    //     parse_str(parse_url($url, PHP_URL_QUERY), $query);
    //     $query = array_filter($query, function ($val) {
    //       return strpos($val, 'https://coupon.m.jd.com') === 0;
    //     });
    //     if (count($query) > 0) {
    //       $good['couponDiscount'] = $discount;
    //       $good['couponLink'] = current($query);
    //     }
    //   }
    // }


    $good = $search['data']['skuPage']['result'][0];
    // 如果有优惠券的话
    // if (isset($good['couponUrl'])) {
    //   $getCodeData['couponUrl'] = $good['couponUrl'];
    // } else {
    //   unset($getCodeData['couponUrl']);
    // }
    $shareReq = [
      'shareType' => 1,
      'skuId' => $id,
      'requestId' => $good['requestId']
    ];
    $shareResponse = Utils::fetchUrl('https://api.m.jd.com/?' . http_build_query([
      'functionId' => 'unionShare',
      'client' => 'apple',
      'clientVersion' => '3.9.2',
      'appid' => 'u_jfapp',
      'loginType' => 2,
      't' => time(),
      'body' => json_encode([
        'funName' => 'share',
        'source' => 30110,
        'param' => [
          'shareReq' => [
            $shareReq
          ]
        ],
        'platform' => 2,
      ])
    ]), [
      'json' => true,
      'cookie' => self::getCookie(),
      'header' => [
        'Content-type: application/json;charset=UTF-8',
        'Origin: https://jingfenapp.jd.com',
        'Referer: https://jingfenapp.jd.com/pages/search'
      ]
    ]);

    if ($shareResponse['code'] === 420) {
      return '系统错误，请联系管理员处理';
    }

    $share = $shareResponse['data']['shareInfo'][0];

    $goodPrice = isset($good['couponAfterPrice']) ? $good['couponAfterPrice'] : $good['price'];
    $result = [
      'name' => $good['skuName'],
      'commission' => [
        [
          'type' => '普通会员',
          'amount' => $good['commission'],
          'rate' => $good['commissionShare'],
        ]
      ],
      'qrcode' => $share['shortUrl'],
      'price' => $goodPrice,
      'tag' => []
    ];

    if (isset($good['plusCommissionShare'])) {
      $result['commission'][] = [
        'type' => 'PLUS会员',
        'amount' => round($goodPrice * $good['plusCommissionShare']) / 100,
        'rate' => $good['plusCommissionShare']
      ];
    }

    if ($good['isPinGou']) {
      $result['tag'][] = [
        'color' => 'error',
        'text' => '京喜'
      ];
    }

    if ($good['isZY']) {
      $result['tag'][] = [
        'color' => 'success',
        'text' => '自营'
      ];
    } else {
      $result['tag'][] = [
        'color' => 'processing',
        'text' => '非自营'
      ];
    }

    return $result;
  }
}
