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
use App\Model\Order as OrderModel;
use Sy\ControllerAbstract;
use Sy\Http\Request;
use Latitude\QueryBuilder\Expression;
use Latitude\QueryBuilder\Conditions;

class Order extends ControllerAbstract {
	private $order;
	public function __construct(OrderModel $order) {
		$this->order = $order;
	}

	public function listAction(Request $request) {
		$user = $request->user;
		$page = intval($request->get['page']);
		if ($page <= 0) {
			$page = 1;
		}
		$select = $this->order->newSelect();
		$select->where(Conditions::make('user = ?', $user['id']));
		$select->offset(15 * $page - 15)->limit(15);
		$result = $this->order->execute($select);
		// 查询总数
		$count = $this->order->get(['user' => $user['id']], [Expression::make('COUNT(*) AS n')]);
		// 拼接数据
		return Utils::getResult([
			'total' => intval($count['n']),
			'page' => $page,
			'pageSize' => 15,
			'list' => $result
		]);
	}

	public function submitAction(Request $request) {
		$platform = intval($request->post['platform']);
		$orderId = $request->post['orderId'];
		$time = $request->post['time'];
		// 检查订单是否有效
		switch ($platform) {
			case 2:
				$orderStatus = Jd::isOrderValid($orderId, $time);
				if ($orderStatus === null) {
					return Utils::getResult(['error' => '订单未找到，请确认订单号和下单时间填写正确']);
				}
				if (1 !== $orderStatus) {
					return Utils::getResult(['error' => '订单无效，状态码：' . $orderStatus]);
				}
				break;
			case 1:
			case 3:
				$orderStatus = Taobao::isOrderValid($orderId, $time);
				if ($orderStatus === null) {
					return Utils::getResult(['error' => '订单未找到，请确认订单号和下单时间填写正确']);
				}
				if (!$orderStatus) {
					return Utils::getResult(['error' => '订单无效']);
				}
				break;
		}
		$id = $this->order->add([
			'user' => $request->user['id'],
			'platform' => $platform,
			'time' => date('Y-m-d H:i:s', $time),
			'orderId' => $orderId,
			'status' => 1,
			'remark' => ''
		]);
		return Utils::getResult([
			'id' => $id
		]);
	}
}
