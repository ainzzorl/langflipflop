import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

export class SegmentFeedback {
  public static readonly RATING_UNDEFINED = 0;
  public static readonly RATING_DOWN = 1;
  public static readonly RATING_UP = 2;

  rating: number = SegmentFeedback.RATING_UNDEFINED;
  checkboxes: any = {};
  text: string = "";
}

export class PersistentTextData {
  id: string;
  lastOpenedTimestamp?: number;
  maxOpenedIndex?: number;
  currentIndex: number;
  // Map segmentId -> SegmentFeedback
  feedbacks?: any;

  constructor(id: string) {
    this.id = id;
    this.currentIndex = 0;
    this.feedbacks = {};
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

  static async getTextData(textId: string): Promise<PersistentTextData> {
    return this.getAllTextData().then((allData) => {
      return allData.has(textId)
        ? allData.get(textId)!
        : new PersistentTextData(textId);
    });
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
    return await Storage.set({
      key: "text-data",
      value: JSON.stringify(this.mapToObject(data)),
    });
  }

  static async updateSegmentFeedback(
    textId: string,
    index: number,
    segmentFeedback: SegmentFeedback
  ): Promise<void> {
    let data = await this.getAllTextData();
    let textData: PersistentTextData;
    if (data.has(textId)) {
      textData = data.get(textId)!;
    } else {
      textData = new PersistentTextData(textId);
    }
    if (!textData.feedbacks) {
      textData.feedbacks = {};
    }
    textData.feedbacks[index] = segmentFeedback;
    data.set(textId, textData);
    return await Storage.set({
      key: "text-data",
      value: JSON.stringify(this.mapToObject(data)),
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

  private static mapToObject(map: Map<any, any>): object {
    let jsonObject: any = {};
    map.forEach((value, key) => {
      jsonObject[key] = value;
    });
    return jsonObject;
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
