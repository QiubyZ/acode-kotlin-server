
<script type='text/javascript' src='https://cdn.trakteer.id/js/embed/trbtn.min.js?date=18-11-2023'></script><script type='text/javascript'>(function(){var trbtnId=trbtn.init('Dukung Saya di Trakteer','#be1e2d','https://trakteer.id/qiubyzhukhi','https://cdn.trakteer.id/images/embed/trbtn-icon.png?date=18-11-2023','40');trbtn.draw(trbtnId);})();</script>

# Acode Kotlin Language Server 
This a Experiment Plugin Kotlin Language Server on Acode

## Acode Plugin Requiriment Installed

1. [Acode Language Client](https://acode.app/plugin/acode.language.client) for Library kotlin Autocomplete

## Setup

### Setup Language Server

- Download _server.zip_ in [kotlin-language-server](https://github.com/fwcd/kotlin-language-server) repository.

- Extract _server.zip_

- copy fullpath binary _kotlin-language-server_

- Goto settings > Edit Settings.json
  add this json and fullpath binary file of _kotlin-language-server_ on serverPath.
  or in a simple way you can click the gear button above

  Example:

  ```json
    "acode.kotlin.client": {
      "serverPath": "/data/data/com.termux/files/home/server/bin/kotlin-language-server"
  }
  ```

  ![Example](./settings.jpg)

  if you not setting. this will take automatically Default serverPath/Default Settings
  is neovim Path bin language server
  _/data/data/com.termux/files/home/.local/share/nvim/mason/bin/kotlin-language-server_



