<?php
/**
 * Utils
 * 
 * @author ShuangYa
 * @package Example
 * @category Library
 * @link https://www.sylingd.com/
 * @copyright Copyright (c) 2019 ShuangYa
 */
namespace App\Library;

class Utils {
	public static function getResult($info = null) {
		$result = [];
		if (is_array($info) && isset($info['error'])) {
			$result = $info;
			$result['success'] = false;
		} else {
			$result['success'] = true;
			$result['data'] = $info;
		}
		return json_encode($result);
	}

	public static function isValidUserName($user) {
		if (!is_string($user)) {
			return 1;
		}
		if (strlen($user) < 4 || strlen($user) > 16) {
			return 2;
		}
		if (!preg_match('/^([a-zA-Z])([a-zA-Z0-9_]+)$/', $user)) {
			return 3;
		}
		return 0;
	}

	public static function fetchUrl($url, $data = []) {
		$ch = curl_init($url);
		//header
		if (!isset($data['UA'])) {
			$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0';
		}
		$header = ['User-Agent: ' . $ua];
		if (isset($data['header'])) {
			$header = @array_merge($header, $data['header']);
		}
		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		if (isset($data['cookie'])) {
			curl_setopt($ch, CURLOPT_COOKIE, $data['cookie']);
		}
		if (isset($data['post'])) {
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data['post']);
		}
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		$r = curl_exec($ch);
		@curl_close($ch);
		if (isset($data['json'])) {
			return json_decode($r, true);
		}
		return $r;
	}
}