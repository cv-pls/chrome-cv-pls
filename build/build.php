#!/usr/bin/php
<?php

  require 'class.privatekey.php';
  require 'class.crxfile.php';
  require 'class.updatemanifest.php';

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

  $key = new PrivateKey($keyFile);

  $crx = new CRXFile($key);
  $crx->open($outFile);
  $crx->addDirContents(__DIR__.'/../src');
  $crx->close();

  $crxUrl = 'http://cv-pls.dev/'.$outFile;

  $updateManifest = new UpdateManifest($key, $crxUrl, $version);
  $updateManifest->generate();
  $updateManifest->save($updateManifestFile);
