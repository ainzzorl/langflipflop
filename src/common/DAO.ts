import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

export class PersistentTextData {
  id: string;
  lastOpenedTimestamp?: number;
  maxOpenedIndex?: number;
  currentIndex: number;

  constructor(id: string) {
    this.id = id;
    this.currentIndex = 0;
  }
}

export class Settings {
  translationDirection: string;
  theme: string;
  interfaceLanguage: string;

  constructor() {
    this.translationDirection = "";
    this.theme = "dark";
    this.interfaceLanguage = "";
  }
}

export class User {
  completedMainFtue: boolean;
  completedTextFtue: boolean;

  constructor() {
    this.completedMainFtue = false;
    this.completedTextFtue = false;
  }
}

export class DAO {
  static async getAllTextData(): Promise<Map<string, PersistentTextData>> {
    const value = await Storage.get({ key: "text-data" });
    const s = value.value;
    if (s !== null) {
      return new Map(Object.entries(JSON.parse(s)));
    } else {
      return new Map([]);
    }
  }

  static async updateTextStamps(textId: string, index: number): Promise<void> {
    let data = await this.getAllTextData();
    let textData: PersistentTextData;
    if (data.has(textId)) {
      textData = data.get(textId)!;
    } else {
      textData = new PersistentTextData(textId);
    }
    textData.lastOpenedTimestamp = Date.now();
    if (
      textData.maxOpenedIndex === undefined ||
      textData.maxOpenedIndex < index
    ) {
      textData.maxOpenedIndex = index;
    }
    textData.currentIndex = index;

    data.set(textId, textData);
    let jsonObject: any = {};
    data.forEach((value, key) => {
      jsonObject[key] = value;
    });
    return await Storage.set({
      key: "text-data",
      value: JSON.stringify(jsonObject),
    });
  }

  static async getSettings(): Promise<Settings> {
    const value = await Storage.get({ key: "settings" });
    const s = value.value;
    let settings;
    if (s !== null) {
      settings = JSON.parse(s);
    } else {
      settings = new Settings();
    }
    if (!settings.theme) {
      settings.theme = "dark";
    }
    if (!settings.interfaceLanguage) {
      settings.interfaceLanguage = getDefaultInterfaceLanguage();
    }
    if (!settings.translationDirection) {
      settings.translationDirection = getDefaultTranslationDirection(
        settings.interfaceLanguage
      );
    }
    return settings;
  }

  static async setSettings(settings: Settings): Promise<void> {
    return await Storage.set({
      key: "settings",
      value: JSON.stringify(settings),
    });
  }

  static async getUser(): Promise<User> {
    const value = await Storage.get({ key: "user" });
    const s = value.value;
    if (s !== null) {
      return JSON.parse(s);
    } else {
      return new User();
    }
  }

  static async setUser(user: User): Promise<void> {
    this.globalUser = user;
    return await Storage.set({
      key: "user",
      value: JSON.stringify(user),
    });
  }

  static globalUser: User = new User();
}

export function getDefaultInterfaceLanguage(): string {
  let browserLocale =
    (navigator.languages && navigator.languages[0]) || navigator.language;
  let parts = browserLocale.split("-");
  let browserLanguage = parts[0];
  if (
    browserLanguage !== "en" &&
    browserLanguage !== "es" &&
    browserLanguage !== "ru"
  ) {
    return "en";
  } else {
    return browserLanguage;
  }
}

export function getDefaultTranslationDirection(
  interfaceLanguage: string
): string {
  if (interfaceLanguage === "es") {
    return "es-en";
  } else if (interfaceLanguage === "ru") {
    return "ru-en";
  } else {
    return "en-es";
  }
}
