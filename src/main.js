import plugin from "../plugin.json";
class AcodePlugin {
  async init() {
    let acodeLanguageClient = acode.require("acode-language-client");
    if (acodeLanguageClient) {
      this.setupLangaugeClient(acodeLanguageClient);
    } else {
      window.addEventListener("plugin.install", ({ detail }) => {
        if (detail.name === "acode-language-client") {
          acodeLanguageClient = acode.require("acode-language-client");
          this.setupLangaugeClient(acodeLanguageClient);
        }
      });
    }
  }
  setupLangaugeClient(acodeLanguageClient) {
    let socket = (this.socket = acodeLanguageClient.getSocketForCommand(
      this.settings.serverPath,
    ));
    let javaClient = new acodeLanguageClient.LanguageClient({
      type: "socket",
      socket,
    });
    acodeLanguageClient.registerService("kotlin|kts", javaClient);
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

  get settingsObject() {
    const AppSettings = acode.require("settings");
    return {
      list: [
        {
          key: "serverPath",
          text: "Path to Java jdtls server",
          prompt: "Path to Java jdtls server",
          promptType: "text",
          value: this.settings.serverPath,
        },
      ],
      cb: (key, value) => {
        switch (key) {
          case "serverPath":
            if (!value.endsWith("")) {
              value = value + "/";
            }
            break;
        }
        AppSettings.value[plugin.id][key] = value;
        AppSettings.update();
      },
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
