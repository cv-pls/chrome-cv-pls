<?php

  namespace CvPls\Build;

  class ExtensionPackage extends \ZipArchive {

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
          if (!$this->addFile($file, $base.basename($file))) {
            throw new \RuntimeException('Error adding file '.$file.' to archive');
          }
        }
      }
    }

  }
