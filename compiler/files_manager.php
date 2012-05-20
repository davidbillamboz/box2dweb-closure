<?php

class FilesManager {
	public static function scanFileNameRecursivly($path = '', &$name = array()) {
		$path = $path == '' ? dirname(__FILE__) : $path;
		$lists = @scandir($path);

		if(!empty($lists)) {
			foreach($lists as $f) {
				if ($f == ".." || $f == "." || $f == '.DS_Store') continue;

				if(is_dir($path . DIRECTORY_SEPARATOR . $f)) {
					self::scanFileNameRecursivly($path . DIRECTORY_SEPARATOR . $f, &$name);
				} else {
					$name[] = $path . DIRECTORY_SEPARATOR . $f;
				}
			}
		}
		return $name;
	}

	public static function emptyFolder($folder) {
		# empty folder
		foreach(glob($folder . '/*') as $file) {
			if(is_dir($file))
				self::emptyFolder($file);
			else
				unlink($file);
		}
	}

	public static function createFile($path, $content) {
		$handle = fopen($path, 'w');
		file_put_contents($path, $content);
		fclose($handle);
	}
}

?>