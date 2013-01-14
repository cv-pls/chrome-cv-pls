<?php

  namespace CvPls\Build\Chrome;

  use \CvPls\Build;

  class AppIdGenerator {

    private $base16Alphabet = array(
      '0' => 'a', '1' => 'b', '2' => 'c', '3' => 'd',
      '4' => 'e', '5' => 'f', '6' => 'g', '7' => 'h',
      '8' => 'i', '9' => 'j', 'a' => 'k', 'b' => 'l',
      'c' => 'm', 'd' => 'n', 'e' => 'o', 'f' => 'p'
    );

    private $dataSigner;

    public function __construct(Build\IDataSigner $dataSigner = NULL) {
      if ($dataSigner !== NULL) {
        $this->setDataSigner($dataSigner);
      }
    }

    public function getDataSigner() {
      return $this->dataSigner;
    }
    public function setDataSigner(Build\IDataSigner $dataSigner) {
      $this->dataSigner = $dataSigner;
    }

    public function getAppId() {
      $key = $this->dataSigner->getPublicKey(Build\IDataSigner::FORMAT_DER);

      $hash = hash('sha256', $key, TRUE);
      $first128 = substr($hash, 0, 16);
      $base16 = strtolower(bin2hex($first128));
      $translated = strtr($base16, $this->base16Alphabet);

      return $translated;
    }

  }
