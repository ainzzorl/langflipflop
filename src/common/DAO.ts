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
}
