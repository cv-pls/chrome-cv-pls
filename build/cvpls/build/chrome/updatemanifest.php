<?php

  namespace CvPls\Build\Chrome;

  class UpdateManifest {

    protected $nsUrl = 'http://www.google.com/update2/response';

    protected $appIdGenerator;
    protected $crxUrl;
    protected $version;

    protected $document;

    public function __construct(AppIdGenerator $appIdGenerator = NULL, $crxUrl = NULL, $version = NULL) {
      if ($appIdGenerator !== NULL) {
        $this->setAppIdGenerator($appIdGenerator);
      }
      $this->setCrxUrl($crxUrl);
      $this->setVersion($version);
    }

    public function getAppIdGenerator() {
      return $this->appIdGenerator;
    }
    public function setAppIdGenerator(AppIdGenerator $appIdGenerator) {
      $this->appIdGenerator = $appIdGenerator;
    }

    public function getCrxUrl() {
      return $this->crxUrl;
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
      $this->document = new \DOMDocument('1.0', 'utf-8');
      $this->document->formatOutput = true;

      $rootEl = $this->document->createElementNS($this->nsUrl, 'gupdate');
      $rootEl->setAttribute('protocol', '2.0');
      $this->document->appendChild($rootEl);

      $appId = $this->appIdGenerator->getAppId();
      $appEl = $this->document->createElementNS($this->nsUrl, 'app');
      $appEl->setAttribute('appid', $appId);
      $rootEl->appendChild($appEl);

      $updateCheckEl = $this->document->createElementNS($this->nsUrl, 'updatecheck');
      $updateCheckEl->setAttribute('codebase', $this->crxUrl);
      $updateCheckEl->setAttribute('version', $this->version);
      $appEl->appendChild($updateCheckEl);
    }
    public function save($path = NULL) {
      if ($path) {
        return $this->document->save($path);
      } else {
        return $this->document->saveXML();
      }
    }

  }
