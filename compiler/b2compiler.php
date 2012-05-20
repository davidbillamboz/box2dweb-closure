<?php

require_once('files_manager.php');

class B2Compiler {

	private $settings = array(
		'googleClosureLibraryPath'  => 'google-closure-library/',
		# relative to closureLibraryPath
		'googleClosurePath'         => 'closure/goog/',
		# relative to closureLibraryPath
		'googleClosureBuilderPath'  => 'closure/bin/build/closurebuilder.py',
		'googleClosureCompilerPath' => 'google-closure-compiler/compiler.jar',
		# path to source folder
		'sourceFolderPath' => 'src',
		# path to binary folder
		'binaryFolderPath' => 'bin',
		# empty the binary folder before compilation
		'cleanBinaryFolder' => true,
		'orderFilePath'     => 'bin/order',
		# keep the order file after extracting
		'removeOrderFile' => true,
		'compiledFilename'            => 'Box2DWeb.js',
		'compiledAndMinifiedFilename' => 'Box2DWeb-min.js',
		# compile develop and minified version
		'compileBoth' => false,
		# available:
		# pretty  : make the compiled code readable
		# minified: the code is small as possible
		'print' => 'pretty',
		# name of global var that'll replace goog
		# default: goog
		'dependencyName'       => 'goog',
		# path to the dependency that'll replace Google Closure
		# default: goog/
		'dependencyPath'       => 'goog/',
		# put all the dependencies in the top of the compiled code
		'putInTopDependencies' => true,

		'skippedFiles' => array(),
		'keepTracker' => false,
		'keepAsserts' => false
	);

	public function __construct($settings = array()) {
		$this->settings = array_merge($this->settings, $settings);
	}

	public function run() {
		if ($this->get('cleanBinaryFolder'))
			$this->cleanBinFolder();

		$files = $this->getFilesOrder();

		$this->replaceGoogleClosurePaths($files);

		if ($this->get('putInTopDependencies'))
			$this->putInTopDependencies($files);

		if ($this->get('compileBoth')) {
			$this->compileBoth($files);
		} else {
			$this->compile($files);
		}

	}

	private function createCompiledFile($compiledCode) {
		if ($this->get('print') == 'minified') {
			$compiledFilename = $this->get('compiledAndMinifiedFilename');
		} else {
			$compiledFilename = $this->get('compiledFilename');
		}
		FilesManager::createFile($this->getBinaryFolderPath() . '/' . $compiledFilename, $compiledCode);
	}

	private function compileBoth($files) {
		$currentPrint = $this->get('print');

		$this->set('print', 'pretty');
		$this->compile($files);

		$this->set('print', 'minified');
		$this->compile($files);

		$this->set('print', $currentPrint);
	}

	private function compile($files) {
		$command = 'java -jar ' . $this->getGoogleClosureCompilerPath();

		if ($this->get('print') == 'pretty')
			$command .= ' --formatting pretty_print';

		# set compiler files
		foreach ($files as $file) {
			$command .= ' --js ' . $file;
		}

		$compiledCode = shell_exec($command);

		if (!$this->get('keepTracker')) {
			$this->removeTracker($compiledCode);
		}
		if (!$this->get('keepAsserts')) {
			$this->removeAsserts($compiledCode);
		}

		$this->replaceDependencyName($compiledCode);
		$this->createCompiledFile($compiledCode);
	}

	private function replaceDependencyName(&$compiledCode) {
		# replace dependency name
		$dependencyName = $this->get('dependencyName');
		if ($dependencyName !== 'goog') {
			$compiledCode = str_replace('goog.', $dependencyName . '.', $compiledCode);
			$compiledCode = str_replace('goog =', $dependencyName . ' =', $compiledCode);
			$compiledCode = str_replace('goog_', $dependencyName . '_', $compiledCode);
		}
	}

	private function removeAsserts(&$compiledCode) {
		// goog.asserts.assert(null != a.length);
		# remove tracker calls in compiled code
		$patterns = array(
			'/goog.asserts.assert\(null \!\= a\.length\)\;*/',
		);
		$compiledCode = preg_replace($patterns, '', $compiledCode);

		# remove tracker class in compiled code
		# option m: match new lines
		# option s: dot replace everything and new lines
		$pattern = '/(goog.asserts \= \{\}\;.*)goog.array \= \{\}\;/ms';
		$compiledCode = preg_replace($pattern, 'goog.array = {};', $compiledCode);
	}

	private function removeTracker(&$compiledCode) {
		# remove tracker calls in compiled code
		# trackCreate, trackFree, trackGet
		$patterns = array(
			'/UsageTracker.get\(\"[A-Za-z0-9.]+\"\)\.[A-Z-a-z0-9]+\(\)[\;\,]?/',
		);
		$compiledCode = preg_replace($patterns, '', $compiledCode);

		# remove tracker class in compiled code
		# option m: match new lines
		# option s: dot replace everything and new lines
		$pattern = '/(var UsageTracker.*)var Box2D/ms';
		$compiledCode = preg_replace($pattern, 'var Box2D', $compiledCode);
	}

	private function replaceGoogleClosurePaths(&$files) {
		$googleClosurePath = $this->getGoogleClosurePath();

		# replace google closure dependencies by the local one
		foreach ($files as $key => $file) {
			$files[$key] = str_replace($googleClosurePath, $this->getDependencyPath(), $file);
		}
	}

	# put in top the google closure dependencies in order
	private function putInTopDependencies(&$files) {
		$dependencies = array();
		$i = count($files);
		while ($i--) {
			$file = $files[$i];
			if (reset(explode('/', $file)) == 'goog') {
				$dependencies[] = $file;
				unset($files[$i]);
			}
		}

		$files = array_values($files); # reindex the array

		foreach ($dependencies as $dependency) {
			array_unshift($files, $dependency);
		}
	}

	private function getFilesOrder() {
		$requireFilePath = $this->getRequireFilePath();
		$builderPath     = $this->getGoogleClosureBuilderPath();
		$orderFilePath   = $this->getOrderFilePath();

		$this->generateRequireFile();

		$command  = $this->getGoogleClosureBuilderPath();
		$command .= ' --root ' . $this->getGoogleClosureLibraryPath();
		$command .= ' --root ' . $this->getSourceFolderPath();
		$command .= ' --input ' . $requireFilePath;
		$command .= ' > ' . $orderFilePath;

		# get files order
		shell_exec($command);

		$orderFileContent = file_get_contents($orderFilePath);
		$files = explode("\n", $orderFileContent);

		if ($this->get('removeOrderFile')) {
			@unlink($orderFilePath);
		}

		# remove require.js from the list
		array_pop($files);
		array_pop($files);
		# don't need it anymore, remove it
		@unlink($requireFilePath);

		return $files;
	}

	# generate a file with just requires
	private function generateRequireFile() {
		$requireFilePath = $this->getRequireFilePath();
		$sourceFolderPath = $this->getSourceFolderPath();

		@unlink($requireFilePath);

		# get all files
		$files = FilesManager::scanFileNameRecursivly($sourceFolderPath);

		# add file namespace
		$content = "goog.provide('require');\n";

		foreach ($files as $filePath) {
			if (in_array($filePath, $this->get('skippedFiles')))
				continue;

			$fileContent = file_get_contents($filePath);
			$namespace = $this->getNameSpace($fileContent);
			if (!!$namespace)
				$content .= "goog.require('" . $namespace . "');\n";
		}

		FilesManager::createFile($requireFilePath, $content);
	}

	private function cleanBinFolder() {
		$binaryFolderPath = $this->getBinaryFolderPath();
		if (is_dir($binaryFolderPath)) {
			FilesManager::emptyFolder($binaryFolderPath);
		} else {
			mkdir($binaryFolderPath);
		}
	}

	private function getNameSpace($content) {
		$pattern = "/goog.provide\(\'([A-Za-z0-9.]+)\'\)/";
		preg_match($pattern, $content, $matches);
		return $matches[1];
	}

	private function set($key, $value) {
		$this->settings[$key] = $value;
	}

	private function get($key) {
		return $this->settings[$key];
	}

	private function getDependencyPath() {
		return $this->get('dependencyPath');
	}

	private function getRequireFilePath() {
		return $this->getSourceFolderPath() . '/require.js';
	}

	private function getSourceFolderPath() {
		return $this->get('sourceFolderPath');
	}

	private function getBinaryFolderPath() {
		return $this->get('binaryFolderPath');
	}

	private function getOrderFilePath() {
		return $this->get('orderFilePath');
	}

	private function getGoogleClosureLibraryPath() {
		return $this->get('googleClosureLibraryPath');
	}

	private function getGoogleClosurePath() {
		return $this->getGoogleClosureLibraryPath() . $this->get('googleClosurePath');
	}

	private function getGoogleClosureBuilderPath() {
		return $this->getGoogleClosureLibraryPath() . $this->get('googleClosureBuilderPath');
	}

	private function getGoogleClosureCompilerPath() {
		return $this->get('googleClosureCompilerPath');
	}

}

?>