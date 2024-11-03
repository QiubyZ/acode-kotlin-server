import plugin from "../plugin.json";
let AppSettings = acode.require("settings");

class AcodePlugin {
  async init() {
    let acodeLanguageClient = acode.require("acode-language-client");
    if (acodeLanguageClient) {
      await this.setupLangaugeClient(acodeLanguageClient);
    } else {
      window.addEventListener("plugin.install", ({ detail }) => {
        if (detail.name == "acode-language-client") {
          acodeLanguageClient = acode.require("acode-language-client");
          this.setupLangaugeClient(acodeLanguageClient);
        }
      });
    }
  }
  async setupLangaugeClient(acodeLanguageClient) {
    let socket = (this.socket = acodeLanguageClient.getSocketForCommand(
      this.settings.serverPath,
    ));
    let javaClient = new acodeLanguageClient.LanguageClient({
      type: "socket",
      socket,
    });
    acodeLanguageClient.registerService("kotlin", javaClient);
    acode.registerFormatter("Kotlin Language Server", ["kotlin"], () =>
      acodeLanguageClient.format(),
    );
  }
  get settingsMenuLayout() {
    // let settings = this.settings;
    return {
      list: [
        {
          index: 0,
          key: "serverPath",
          promptType: "text",
          prompt:"Change the serverPath before running.",
          text: "Kotlin Executable File Path",
          value: this.settings.serverPath,
        },
      ],
      
      cb: (key, value) => {
        AppSettings.value[plugin.id][key] = value;
        AppSettings.update();
      },
    };
  }
  
  get settings() {
    if (!window.acode) {
      return this.defaultSettings;
    }
    let value = AppSettings.value[plugin.id];
    if (!value) {
      value = AppSettings.value[plugin.id] = this.defaultSettings;
      AppSettings.update();
    }
    return value;
  }
  get defaultSettings() {
    return {
      serverPath:
        "/data/data/com.termux/files/home/.local/share/nvim/mason/bin/kotlin-language-server",
    };
  }
  async destroy() {}
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(
    plugin.id,
    async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      acodePlugin.baseUrl = baseUrl;
      await acodePlugin.init($page, cacheFile, cacheFileUrl);
    },
    acodePlugin.settingsMenuLayout,
  );

  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
