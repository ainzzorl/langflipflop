import { categories as allCategories } from "./categories.json";
import { getLocaleMessages } from "./Common";

export default class TextMeta {
  id: string;
  title: string;
  difficulty: string;
  categories: Array<string>;
  numSegments: number;
  sourceLink?: string;
  sourceText?: string;

  constructor(data: any) {
    this.title = data["en"]["title"];
    this.id = data["meta"]["id"];
    this.difficulty = data["meta"]["difficulty"];
    this.categories = data["meta"]["categories"];
    this.numSegments = data["meta"]["numSegments"];
    this.sourceLink = data["meta"]["sourceLink"];
    this.sourceText = data["meta"]["sourceText"];
  }

  public prettyCategories(): string {
    let localeMessages = getLocaleMessages();
    return allCategories
      .filter((c) => this.categories.includes(c))
      .map((c) => localeMessages[`category.${c}`])
      .join(", ");
  }
}
