import { CATEGORIES, CATEGORY_MAP } from "./Categories";

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
    return CATEGORIES.filter((c) => this.categories.includes(c))
      .map((c) => CATEGORY_MAP.get(c))
      .join(", ");
  }
}
