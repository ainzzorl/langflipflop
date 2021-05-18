import { categories as allCategories } from "./categories.json";
import { getLocaleMessages } from "./Common";

export default class TextMeta {
  id: string;
  // language -> title
  titles: Map<string, string>;
  difficulty: string;
  categories: Array<string>;
  numSegments: number;
  sourceLink?: string;
  sourceText?: string;
  languages: Array<string>;

  constructor(data: any) {
    this.titles = new Map<string, string>();
    Object.keys(data).forEach((key) => {
      if (key !== "meta") {
        this.titles.set(key, data[key]["title"]);
      }
    });
    this.id = data["meta"]["id"];
    this.difficulty = data["meta"]["difficulty"];
    this.categories = data["meta"]["categories"];
    this.numSegments = data["meta"]["numSegments"];
    this.sourceLink = data["meta"]["sourceLink"];
    this.sourceText = data["meta"]["sourceText"];
    this.languages = data["meta"]["languages"];
  }

  public prettyCategories(): string {
    let localeMessages = getLocaleMessages();
    return allCategories
      .filter((c) => this.categories.includes(c))
      .map((c) => localeMessages[`category.${c}`])
      .join(", ");
  }
}
