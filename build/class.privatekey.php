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
