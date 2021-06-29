<?php
/**
 * 管理员
 * 
 * @author ShuangYa
 * @package Example
 * @category Controller
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */
namespace App\Module\Api\Controller;

use App\Library\Taobao;
use App\Library\Utils;
use App\Model\Order;
use Sy\ControllerAbstract;
use Sy\Http\Request;
use Latitude\QueryBuilder\Expression;
use Latitude\QueryBuilder\Conditions;

class Admin extends ControllerAbstract {
	private $order;
	public function __construct(Order $order) {
		$this->order = $order;
	}

  public function loginTaobaoAction(Request $request) {
    return Utils::getResult(Taobao::login());
  }

	public function orderAction(Request $request) {
		$user = $request->get['user'];
		$page = intval($request->get['page']);
		if ($page <= 0) {
			$page = 1;
		}
		$select = $this->order->newSelect();
    if ($user) {
      $select->where(Conditions::make('user = ?', $user));
    }
		$select->offset(15 * $page - 15)->limit(15);
		$result = $this->order->execute($select);
		// 查询总数
    if ($user) {
      $count = $this->order->get(['user' => $user], [Expression::make('COUNT(*) AS n')]);
    } else {
      $count = $this->order->get(null, [Expression::make('COUNT(*) AS n')]);
    }
		// 拼接数据
		return Utils::getResult([
			'total' => intval($count['n']),
			'page' => $page,
			'pageSize' => 15,
			'list' => $result
		]);
	}

	public function updateOrderAction(Request $request) {
		$id = $request->get['id'] || $request->post['id'];
		$data = [];
		if (isset($request->post['status']) || isset($request->get['status'])) {
			$data['status'] = $request->get['status'] || $request->post['status'];
		}
		if (isset($request->post['remark'])) {
			$data['remark'] = $request->post['remark'];
		}
		if (count($data) > 0) {
			$this->order->set($data, $id);
		}
		return Utils::getResult();
	}
}