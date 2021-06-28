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

class Jd {
  public static function getCookie() {
    static $ck = '';

    if (empty($ck)) {
      $ck = trim(file_get_contents(App::$config->get('jd_cookie')));
    }

    return $ck;
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
        'amount' => round(($good['finalPrice'] * $good['plusCommissionShare']) / 100),
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

    return $good;
  }
}
