<?php

require('compiler/b2compiler.php');

$b2compiler = new B2Compiler(array(
	'googleClosureLibraryPath'  => '~/Tools/google-closure-library/',
	# relative to closureLibraryPath
	'googleClosurePath'         => 'closure/goog/',
	# relative to closureLibraryPath
	'googleClosureBuilderPath'  => 'closure/bin/build/closurebuilder.py',
	'googleClosureCompilerPath' => '~/Tools/google-closure-compiler/compiler.jar',
	# path to source folder
	'sourceFolderPath' => 'src',
	# path to binary folder
	'binaryFolderPath' => 'bin',
	# empty the binary folder before compilation
	'cleanBinaryFolder' => true,
	'orderFilePath'   => 'bin/order',
	# keep the order file after extracting
	'removeOrderFile' => true,
	'compiledFilename'         => 'Box2DWeb.js',
	'compiledMinifiedFilename' => 'Box2DWeb-min.js',
	# compile develop and minified version
	'compileBoth' => true,
	# available:
	# pretty  : make the compiled code readable
	# minified: the code is small as possible
	'print' => 'minified',
	# name of global var that'll replace goog
	# default: goog
	'dependencyName'       => 'goog',
	# path to the dependency that'll replace Google Closure
	# default: goog/
	'dependencyPath'       => 'goog/',
	# put all the dependencies in the top of the compiled code
	'putInTopDependencies' => true,

	# skipped files dureing compilation
	# should not be required in any other file
	'skippedFiles' => array('deps.js'),

	# keep object tracking and the calls in files
	'keepTracker' => false,
	# keep goog.asserts and the calls in files
	'keepAsserts' => false

));
$b2compiler->run();

?>