<?php

  class UpdateManifest {

    protected $nsUrl = 'http://www.google.com/update2/response';
    protected $base16Alphabet = array(
      '0' => 'a', '1' => 'b', '2' => 'c', '3' => 'd',
      '4' => 'e', '5' => 'f', '6' => 'g', '7' => 'h',
      '8' => 'i', '9' => 'j', 'a' => 'k', 'b' => 'l',
      'c' => 'm', 'd' => 'n', 'e' => 'o', 'f' => 'p'
    );

    protected $key;
    protected $crxUrl;
    protected $version;

    protected $document;

    public function __construct($key = NULL, $crxUrl = NULL, $version = NULL) {
      $this->setKey($key);
      $this->setCrxUrl($crxUrl);
      $this->setVersion($version);
    }

    public function getKey() {
      return $this->key;
    }
    public function setKey($key) {
      $this->key = $key;
    }

    public function getCrxUrl() {
      return $this->key;
    }
    public function setCrxUrl($crxUrl) {
      $this->crxUrl = $crxUrl;
    }

    public function getVersion() {
      return $this->version;
    }
    public function setVersion($version) {
      $this->version = $version;
    }

    public function generate() {
      $this->document = new DOMDocument('1.0', 'utf-8');
      $this->document->formatOutput = true;

      // Sorry, it's late, I'm lazy
      $this->document
        ->appendChild($this->document->createElementNS($this->nsUrl, 'gupdate'))
        ->setAttribute('protocol', '2.0')->ownerElement
          ->appendChild($this->document->createElementNS($this->nsUrl, 'app'))
          ->setAttribute('appid', $this->getAppId())->ownerElement
            ->appendChild($this->document->createElementNS($this->nsUrl, 'updatecheck'))
            ->setAttribute('codebase', $this->crxUrl)->ownerElement
            ->setAttribute('version', $this->version);
    }

    public function save($path = NULL) {
      if ($path) {
        return $this->document->save($path);
      } else {
        return $this->document->saveXML();
      }
    }

    protected function getAppId() {
      $key = $this->key->getPublicKey();
      $hash = hash('sha256', $key, TRUE);
      $first128 = substr($hash, 0, 16);
      $base16 = bin2hex($first128);
      $translated = strtr($base16, $this->base16Alphabet);
      return $translated;
    }

  }
