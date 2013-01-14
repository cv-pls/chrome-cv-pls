#!/usr/bin/php
<?php

  use \CvPls\Build;

  require __DIR__.'/autoload.php';

  $version = json_decode(file_get_contents(__DIR__.'/../src/manifest.json'))->version;

  // process arguments
  if (!isset($argv[1])) {
    exit("Usage: build.php <private key file> [<out file>] [<manifest file>]\n");
  } else if (!is_file($argv[1])) {
    exit("The specified private key file does not exist\n");
  }
  $keyFile = $argv[1];

  if (isset($argv[2])) {
    $outFile = $argv[2];
  } else {
    $outFile = "cv-pls_{$version}.crx";
  }

  if (isset($argv[3])) {
    $updateManifestFile = $argv[3];
  } else {
    $updateManifestFile = 'updates.xml';
  }

  $dataSigner = new Build\DataSigner($keyFile);

  $crx = new Build\Chrome\CRXFile($dataSigner);
  $crx->open($outFile);
  $crx->addDirContents(__DIR__.'/../src');
  $crx->close();

  $crxUrl = 'http://cv-pls.dev/'.$outFile;

  $appIdGenerator = new Build\Chrome\AppIdGenerator($dataSigner);
  $updateManifest = new Build\Chrome\UpdateManifest($appIdGenerator, $crxUrl, $version);
  $updateManifest->generate();
  $updateManifest->save($updateManifestFile);
