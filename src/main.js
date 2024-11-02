import plugin from "../plugin.json";
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
  get settings() {
    if (!window.acode) {
      return this.defaultSettings;
    }
    const AppSettings = acode.require("settings");
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
  async destroy() { }
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
  );
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
