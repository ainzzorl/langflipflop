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

  constructor() {
    this.translationDirection = "en-es";
    this.theme = "dark";
  }
}

export class User {
  completedFtue: boolean;

  constructor() {
    this.completedFtue = false;
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
    if (s !== null) {
      let settings: Settings = JSON.parse(s);
      if (!settings.theme) {
        settings.theme = "dark";
      }
      return settings;
    } else {
      return new Settings();
    }
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
    return await Storage.set({
      key: "user",
      value: JSON.stringify(user),
    });
  }
}
