<?php

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
