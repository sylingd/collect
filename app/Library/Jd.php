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
      'pay' => $order['pay_price'], // 付款金额
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
    $orders = array_filter($orders, function ($item) use ($orderId) {
      return $item['orderId'] === $orderId;
    });

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
      'create_time' => $orders[0]['orderTime'],
    ];
    foreach ($orders as $order) {
      if (!self::isValidStatus($order['status'])) {
        continue;
      }
      $total['status'] += $order['status'];
      $total['pay'] += $order['pay'];
      $total['expect_rebate'] += $order['expect_rebate'];
      $total['rebate'] += $order['rebate'];
    }
    return $total;
  }

  public static function getUrl($id) {
    $searchData = [
      'bonusIds' => null,
      'categoryId' => null,
      'cat2Id' => null,
      'cat3Id' => null,
      'deliveryType' => 0,
      'fromCommissionRatio' => null,
      'toCommissionRatio' => null,
      'fromPrice' => null,
      'hasCoupon' => 0,
      'isHot' => null,
      'preSale' => 0,
      'isPinGou' => 0,
      'jxFlag' => 0,
      'isZY' => 0,
      'isCare' => 0,
      'lock' => 0,
      'orientationFlag' => 0,
      'sort' => null,
      'sortName' => null,
      'key' => $id,
      'searchType' => 'st2',
      'keywordType' => 'kt0',
    ];

    if (strpos($id, 'u.jd.com')) {
      // 短链接
      $searchData['searchType'] = 'st1';
      $searchData['keywordType'] = 'kt1';
    }

    $search = Utils::fetchUrl('https://union.jd.com/api/goods/search', [
      'json' => true,
      'cookie' => self::getCookie(),
      'header' => [
        'Content-type: application/json;charset=UTF-8',
        'Referer: https://union.jd.com/'
      ],
      'post' => json_encode([
        'pageNo' => 1,
        'pageSize' => 1,
        'searchUUID' => md5(uniqid()),
        'data' => $searchData,
      ])
    ]);

    if ($search['code'] === 80001) {
      return '系统错误，请联系管理员处理';
    }

    $good = null;
    if (!isset($search['data']['unionGoods']) || count($search['data']['unionGoods']) === 0) {
      return '未找到该商品，可能该商品不支持返利';
    }
    if (isset($search['data']['unionRecommendGoods']) && $search['data']['unionRecommendGoods'] === null) {
      return '未找到该商品，可能该商品不支持返利';
    }

    // 尝试拉一下GWD的API，看看有没有优惠券
    $gwd = Utils::fetchUrl('https://m.gwdang.com/trend/data_new?' . http_build_query([
      'opt' => 'product',
      'dp_id' => $id . '-3',
      'search_url' => 'https://item.jd.com/' + $id . '.html',
      'period' => 180,
      'from' => 'wx_1'
    ]), [
      'json' => true,
      'timeout' => 3
    ]);
    if (is_array($gwd) && isset($gwd['data']) && isset($gwd['data']['dp_info']) && isset($gwd['data']['dp_info']['coupon'])) {
      $url = $gwd['data']['dp_info']['coupon']['url'];
      $discount = intval($gwd['data']['dp_info']['coupon']['amount']);
      if (!isset($good['couponDiscount']) || $good['couponDiscount'] < $discount) {
        parse_str(parse_url($url, PHP_URL_QUERY), $query);
        $query = array_filter($query, function ($val) {
          return strpos($val, 'https://coupon.m.jd.com') === 0;
        });
        if (count($query) > 0) {
          $good['couponDiscount'] = $discount;
          $good['couponLink'] = current($query);
        }
      }
    }


    $good = $search['data']['unionGoods'][0][0];

    $getCodeData = [
      'couponLink' => '',
      'isPinGou' => $good['isPinGou'],
      'materialId' => $good['skuId'],
      'materialType' => 1,
      'planId' => $good['planId'],
      'promotionId' => 3003764166,
      'promotionType' => 3,
      'promotionTypeId' => 4100447096,
      'receiveType' => 'cps',
      'wareUrl' => 'http://item.jd.com/' . $good['skuId'] . '.html',
      'isSmartGraphics' => 0,
      'requestId' => $good['requestId'],
    ];
    // 如果有优惠券的话
    if (isset($good['couponLink'])) {
      $getCodeData['couponLink'] = $good['couponLink'];
    } else {
      unset($getCodeData['couponLink']);
    }
    $getCode = Utils::fetchUrl('https://union.jd.com/api/receivecode/getCode', [
      'json' => true,
      'cookie' => self::getCookie(),
      'header' => [
        'Content-type: application/json;charset=UTF-8',
        'Referer: https://union.jd.com/'
      ],
      'post' => json_encode([
        'data' => $getCodeData
      ])
    ]);

    $result = [
      'name' => $good['skuName'],
      'commission' => [
        [
          'type' => '普通会员',
          'amount' => $good['wlCommission'],
          'rate' => $good['wlCommissionRatio'],
        ]
      ],
      'qrcode' => $getCode['data']['data']['shortCode'],
      'price' => $good['finalPrice'],
      'tag' => []
    ];

    if (isset($good['plusCommissionShare'])) {
      $result['commission'][] = [
        'type' => 'PLUS会员',
        'amount' => round($good['finalPrice'] * $good['plusCommissionShare']) / 100,
        'rate' => $good['plusCommissionShare']
      ];
    }

    if (isset($good['couponLink'])) {
      $result['coupon'] = [
        'total' => $good['couponQuota'],
        'discount' => $good['couponDiscount'],
        'qrcode' => ''
      ];
    }

    if (isset($getCode['data']['data']['couponShortCode'])) {
      $result['coupon']['qrcode'] = $getCode['data']['data']['couponShortCode'];
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
