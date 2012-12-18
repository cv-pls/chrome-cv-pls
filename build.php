#!/usr/bin/php
<?php

  class PrivateKey {

    private $pemFile;
    private $privateKey;
    private $publicKey;

    private function pem2der($pem) {
      return base64_decode(implode('', array_slice(preg_split('/[\r\n]+/', trim($pem)), 1, -1)));
    }

    public function __construct($pemFile) {
      if (!is_file($pemFile) || !is_readable($pemFile)) {
        throw new Exception('The specified file does not exist or is not readable');
      } else if ((!$privateKey = openssl_pkey_get_private("file://$pemFile")) || (!$details = openssl_pkey_get_details($privateKey))) {
        throw new Exception('Could not obtain a private key from the specified file');
      }
      $this->privateKey = $privateKey;
      $this->publicKey = $this->pem2der($details['key']);
    }

    public function getPublicKey() {
      return $this->publicKey;
    }

    public function signFile($file) {
      if (!is_file($file) || !is_readable($file)) {
        throw new Exception('The specified file does not exist or is not readable');
      } else if (!openssl_sign(file_get_contents($file), $signature, $this->privateKey, OPENSSL_ALGO_SHA1)) {
        throw new Exception('An error occured while generating the file signature');
      }
      return $signature;
    }

  }

  class CRXFile extends ZipArchive {

    private $isOpen = FALSE;

    private $privateKey;

    private $tmpDir;
    private $tmpFile;

    private $crxVersion = 2;
    private $outFile;

    private function streamIsWritable($stream) {
      $meta = stream_get_meta_data($stream);
      return (bool) preg_match('/(^(w|a|x|c)|r\+$)/i', $meta['mode']);
    }

    private function makeCrxHeader() {
      $publicKey = $this->privateKey->getPublicKey();
      $signature = $this->privateKey->signFile($this->tmpFile);

      $magicNumber = "Cr24";
      $crxVersion = pack('V', $this->crxVersion);
      $keyLength = pack('V', strlen($publicKey));
      $sigLength = pack('V', strlen($signature));

      return $magicNumber.$crxVersion.$keyLength.$sigLength.$publicKey.$signature;
    }

    public function __construct(PrivateKey $privateKey, $tmpDir = NULL) {
      if ($tmpDir === NULL) {
        $tmpDir = sys_get_temp_dir();
      }
      $this->privateKey = $privateKey;
      $this->tmpDir = (string) $tmpDir;
    }
    public function __destruct() {
      $this->close();
    }

    public function getCrxVersion() {
      return $this->crxVersion;
    }
    public function setCrxVersion($version) {
      $this->crxVersion = (int) $version;
    }

    public function open($fileName, $flags = ZIPARCHIVE::CREATE) {
      $this->outFile = $fileName;
      $this->tmpFile = $this->tmpDir.'/'.uniqid().'.zip';
      if (file_exists($this->tmpFile)) {
        unlink($this->tmpFile);
      }
      parent::open($this->tmpFile, ZIPARCHIVE::CREATE);
      $this->isOpen = TRUE;
    }
    public function close() {
      if ($this->isOpen) {
        parent::close();
        $header = $this->makeCrxHeader();
        file_put_contents($this->outFile, $header.file_get_contents($this->tmpFile));
        unlink($this->tmpFile);
        $this->isOpen = FALSE;
      }
    }

    public function addDir($dir, $localName = NULL) {
      if ($localName === NULL) {
        $localName = basename($dir);
      }
      $this->addEmptyDir($localName);
      $this->addDirContents($dir, $localName);
    }
    public function addDirContents($dir, $base = '') {
      $base = ltrim($base.'/', '/');
      foreach (glob("$dir/*") as $file) {
        if (is_dir($file)) {
          $this->addDir($file, $base.basename($file));
        } else {
          $this->addFile($file, $base.basename($file));
        }
      }
    }

  }

  if (!isset($argv[1])) {
    exit("Usage: build.php <private key file> [<out file>]\n");
  } else if (!is_file($argv[1])) {
    exit("The specified private key file does not exist\n");
  }
  $keyFile = $argv[1];

  if (isset($argv[2])) {
    $outFile = $argv[2];
  } else {
    $version = json_decode(file_get_contents('src/manifest.json'))->version;
    $outFile = "cv-pls_{$version}.crx";
  }

  $crx = new CRXFile(new PrivateKey($keyFile));

  $crx->open($outFile);
  $crx->addDirContents('src');
  $crx->close();
