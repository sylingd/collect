<?php
/**
 * User
 * 
 * @author ShuangYa
 * @package Example
 * @category Service
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */
namespace App\Service;

use App\Model\User as UserModel;
use Psr\SimpleCache\CacheInterface;

class User {
	const CACHE_TIME = 3600;
	const CACHE_KEY = 'user_';
	private $user;
	private $cache;
	private $hotCache = [];
	public function __construct(UserModel $user, CacheInterface $cache) {
		$this->user = $user;
		$this->cache = $cache;
	}

	public function removeCache($id) {
		if (!is_string($id) && !is_numeric($id)) {
			return;
		}
		unset($this->hotCache[$id]);
		$this->cache->delete(self::CACHE_KEY . $id);
	}

	public function get($id) {
		$can_cache = is_string($id) || is_numeric($id);
		if ($can_cache && isset($this->hotCache[$id])) {
			return $this->hotCache[$id];
		}
		if ($can_cache) {
			$user = $this->cache->get(self::CACHE_KEY . $id);
			if ($user !== null) {
				return $user;
			}
		}
		$user = $this->user->get($id);
		if (is_array($user) && $can_cache) {
			$this->hotCache[$id] = $user;
			$this->cache->set(self::CACHE_KEY . $id, $user, self::CACHE_TIME);
		}
		return $user;
	}

	public function set($set, $id) {
		if (is_string($id) || is_numeric($id)) {
			$this->removeCache($id);
		}
		return $this->user->set($set, $id);
	}

	public function add($data) {
		return $this->user->add($data);
	}
}