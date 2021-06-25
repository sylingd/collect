<?php
/**
 * Token
 * 
 * @author ShuangYa
 * @package Example
 * @category Model
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */
namespace App\Model;

use Sy\ModelAbstract;

class Order extends ModelAbstract {
	protected $_table_name = 'fan_order';
	protected $_primary_key = 'id';
}