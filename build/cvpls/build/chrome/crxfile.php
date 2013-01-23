<?php

  namespace CvPls\Build\Chrome;

  use \CvPls\Build;

  class CRXFile extends Build\ExtensionPackage {

    private $isOpen = FALSE;

    private $crxVersion = 2;
    private $dataSigner;
    private $tmpDir;

    private $tmpFile;
    private $outFile;

    private function isReallyWritable($path) {
      if (is_writable($path)) {
        return TRUE;
      }

      $dirname = str_replace('\\', '/', dirname($path)); // Windows converts / to \ - grrrr
      if ($dirname !== '' && $dirname !== $path) {
        return $this->isReallyWritable($dirname);
      }

      return FALSE;
    }

    private function makeCrxHeader($data) {
      $publicKey = $this->dataSigner->getPublicKey(Build\IDataSigner::FORMAT_DER);
      $signature = $this->dataSigner->signString($data);

      $magicNumber = "Cr24";
      $crxVersion  = pack('V', $this->crxVersion);
      $keyLength   = pack('V', strlen($publicKey));
      $sigLength   = pack('V', strlen($signature));

      return $magicNumber.$crxVersion.$keyLength.$sigLength.$publicKey.$signature;
    }

    public function __construct(Build\IDataSigner $dataSigner, $tmpDir = NULL) {
      if ($tmpDir === NULL) {
        $tmpDir = sys_get_temp_dir();
      }
      $this->setDataSigner($dataSigner);
      $this->setTmpDir($tmpDir);
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

    public function getDataSigner() {
      return $this->dataSigner;
    }
    public function setDataSigner(Build\IDataSigner $dataSigner) {
      $this->dataSigner = $dataSigner;
    }

    public function getTmpDir() {
      return $this->tmpDir;
    }
    public function setTmpDir($tmpDir) {
      $this->tmpDir = $tmpDir;
    }

    public function open($fileName, $flags = \ZIPARCHIVE::CREATE) {
      $this->outFile = $fileName;
      $this->tmpFile = $this->tmpDir.'/'.uniqid().'.zip';

      if (is_file($this->tmpFile)) {
        unlink($this->tmpFile);
      }
      if (!$this->isReallyWritable($this->tmpFile)) {
        throw new \InvalidArgumentException('Temporary file path is not writable');
      }
      if (!is_dir(dirname($this->tmpFile))) {
        if (!mkdir(dirname($this->tmpFile), 0744, TRUE)) {
          throw new \InvalidArgumentException('Temporary directory does not exist and could not be created');
        }
      }

      parent::open($this->tmpFile, \ZIPARCHIVE::CREATE);
      $this->isOpen = TRUE;
    }
    public function close() {
      if ($this->isOpen) {
        parent::close();

        $data = file_get_contents($this->tmpFile);
        unlink($this->tmpFile);
        $this->isOpen = FALSE;

        $header = $this->makeCrxHeader($data);
        if (!file_put_contents($this->outFile, $header.$data)) {
          throw new \RuntimeException('Unable to write output file');
        }
      }
    }

  }
