import plugin from "../plugin.json";
let AppSettings = acode.require("settings");

class AcodePlugin {
  constructor() {
    this.name_language_type = "kotlin"
    this.languageserver = "kotlin-language-server"
    this.standart_args = []
    this.initializeOptions = {
      initializationOptions: {}
    }
  }

  async init($page, cacheFile, cacheFileUrl) {
    let acodeLanguageClient = acode.require("acode-language-client");
    if (acodeLanguageClient) {
      await this.setupLanguageClient(acodeLanguageClient);
    } else {
      window.addEventListener("plugin.install", ({ detail }) => {
        if (detail.name === "acode-language-client") {
          acodeLanguageClient = acode.require("acode-language-client");
          this.setupLanguageClient(acodeLanguageClient);
        }
      });
    }
  }
  
  get settings() {
    // UPDATE SETTING SAAT RESTART ACODE
    if (!window.acode) return this.defaultSettings;
    let value = AppSettings.value[plugin.id];
    if (!value) {
      //Menjadikan Method defaultSettings sebagai nilai Default
      value = AppSettings.value[plugin.id] = this.defaultSettings;
      AppSettings.update();
    }
    return value;
  }
  
  get settingsMenuLayout() {
    return {
      list: [
        {
          index: 0,
          key: "serverPath",
          promptType: "text",
          prompt: "Change the serverPath before running.",
          text: "Kotlin Executable File Path",
          value: this.settings.serverPath,
        },
        {
          index: 1,
          key: "arguments",
          promptType: "text",
          info: "For multiple arguments, please use comma ','<br>Example: --stdio, -v, -vv",
          prompt: "Argument Of Language Server",
          text: "Kotlin Argument",
          value: this.settings.arguments.join(", ")
        },
      ],

      cb: (key, value) => {
        switch (key) {
          case 'arguments':
            value = value ? value.split(",").map(item => item.trim()) : [];
            break;
        }
        AppSettings.value[plugin.id][key] = value;
        AppSettings.update();
      },
    };
  }

  get defaultSettings() {
    return {
      serverPath: this.languageserver,
      arguments: this.standart_args,
      languageClientConfig: this.initializeOptions
    };
  }

  async setupLanguageClient(acodeLanguageClient) {
    let socket = acodeLanguageClient.getSocketForCommand(
      this.settings.serverPath,
      this.settings.arguments,
    );


    let KotlinClient = new acodeLanguageClient.LanguageClient({
      type: "socket",
      socket,
      initializationOptions: this.settings.languageClientConfig.initializationOptions
    });
    acodeLanguageClient.registerService(this.name_language_type, KotlinClient);


    let handler = () => {
      KotlinClient.connection.onNotification("window/showMessage", ({ params }) => {
        console.log("ShowMessage: " + params.message)
      });
      KotlinClient.connection.onNotification("window/workDoneProgress/create", params => {
        const deb = "OnNotifiy Progress " + this.languageserver
        console.log(`${deb} ${params.message}`)
        window.toast(`${deb}\n${params.message}`, 2000)
      });
      KotlinClient.connection.onRequest("window/workDoneProgress/create", params => {
        const deb = "Request WorkDone Progress " + this.languageserver
        console.log(`${deb} ${params.message}`)
        window.toast(`${deb}\n${params.message}`, 2000)
      });
    }
    socket.addEventListener("open", () => {
      if (KotlinClient.isInitialized) handler();
      else KotlinClient.requestsQueue.push(() => handler());
      console.log(`OPEN CONNECTION ${this.languageserver}`)
    });

    acode.registerFormatter(plugin.name, [this.name_language_type], () =>
      acodeLanguageClient.format(),
    );

  }

  async destroy() {
    if (AppSettings.value[plugin.id]) {
      delete AppSettings.value[plugin.id];
      AppSettings.update();
    }
    window.toast(`Delete Config from ${plugin.id}`)
  }
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
