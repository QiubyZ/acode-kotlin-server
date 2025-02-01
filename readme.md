# Acode Kotlin Language Server

This a Experiment Plugin Kotlin Language Server on Acode.

**Please Support Me** 🥺

<a href="https://trakteer.id/qiubyzhukhi/tip" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png?date=18-11-2023" height="40" style="border:0px;height:40px;" alt="Trakteer Saya"></a>
# Setup Plugin & Language Server Protocol (LSP)
## Acode Plugin Requiriment Installed

1. [Acode Language Client](https://acode.app/plugin/acode.language.client) for Library kotlin Autocomplete
  2. Follow the instructions there to run the Language Server.
  3. you can watch my video to install *Acode Language Client* [Click Here](https://youtu.be/Rc-jvCWHG9E?si=VuY0VCMD2jnn3ptE), 
     
## How To Run Gradle Project with CodeRunner?
  This is a video tutorial reference on how to run a Gradle Project.
  [Click Here](https://youtube.com/shorts/tc4U8FwaEnA?si=5OUDtd8OavP3rf1K)
  

### Setup Language Server

- Download _server.zip_ in [kotlin-language-server](https://github.com/fwcd/kotlin-language-server) repository.

- Extract _server.zip_

- copy fullpath binary _kotlin-language-server_

- Goto settings > Edit Settings.json
  add this json and fullpath binary file of _kotlin-language-server_ on serverPath.
  or in a simple way you can click the gear button above

  Example:

  ```json
    "acode.kotlin.server": {
      "serverPath": "/data/data/com.termux/files/home/server/bin/kotlin-language-server"
  }
  ```

  ![Example](https://raw.githubusercontent.com/QiubyZ/acode-kotlin-server/refs/heads/main/settings.jpg)

  if you not setting. this will take automatically Default serverPath/Default Settings
  is neovim Path bin language server
  _/data/data/com.termux/files/home/.local/share/nvim/mason/bin/kotlin-language-server_
