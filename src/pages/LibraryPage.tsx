import React from "react";
import "./LibraryPage.css";

import TextMeta from "../common/TextMeta";

import TextCard from "../components/TextCard";
import { CATEGORIES, CATEGORY_MAP } from "../common/Categories";

import {
  IonContent,
  IonLabel,
  IonPage,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { DAO, PersistentTextData, Settings } from "../common/DAO";

import deepEqual from "fast-deep-equal/es6";

import queryString from "query-string";

class LibraryPage extends React.Component<
  {},
  {
    texts?: Array<TextMeta>;
    categoryFilter?: string;
    difficultyFilter?: string;
    persistentData?: Map<string, PersistentTextData>;
    settings?: Settings;
  }
> {
  constructor(props: any) {
    super(props);

    let queryParams = queryString.parse(window.location.search);

    this.state = {
      texts: undefined,
      categoryFilter: (queryParams["category"] as string) || undefined,
      difficultyFilter: (queryParams["difficulty"] as string) || undefined,
      persistentData: undefined,
      settings: undefined,
    };

    fetch("assets/data/texts.json")
      .then((res) => res.json())
      .then((res) => {
        let textList = res["texts"];
        return Promise.all(
          textList.map((textId: string) => {
            return fetch(
              "assets/data/texts/" + textId + ".json"
            ).then((value) => value.json());
          })
        );
      })
      .then((textDatas: Array<any>) => {
        let textMetas = textDatas.map((data) => {
          return new TextMeta(data);
        });
        this.setState((state) => ({
          texts: textMetas,
        }));
      });

    this.setCategoryFilter = this.setCategoryFilter.bind(this);
    this.setDifficultyFilter = this.setDifficultyFilter.bind(this);
    this.loadPersistentData = this.loadPersistentData.bind(this);
  }

  setCategoryFilter(value: string) {
    this.setState((state) => ({
      categoryFilter: value,
    }));
    if (window.history.replaceState) {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set("category", value);
      var newURL =
        window.location.origin +
        window.location.pathname +
        "?" +
        searchParams.toString();
      window.history.replaceState({ path: newURL }, "", newURL);
    }
  }

  setDifficultyFilter(value: string) {
    this.setState((state) => ({
      difficultyFilter: value,
    }));
    if (window.history.replaceState) {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set("difficulty", value);
      var newURL =
        window.location.origin +
        window.location.pathname +
        "?" +
        searchParams.toString();
      window.history.replaceState({ path: newURL }, "", newURL);
    }
  }

  componentDidMount() {
    this.loadPersistentData();
  }

  componentDidUpdate() {
    this.loadPersistentData();
  }

  loadPersistentData() {
    DAO.getAllTextData().then((persistentData) => {
      DAO.getSettings().then((settings) => {
        if (
          !deepEqual(this.state.persistentData, persistentData) ||
          !deepEqual(this.state.settings, settings)
        ) {
          this.setState(() => ({
            persistentData: persistentData,
            settings: settings,
          }));
        }
      });
    });
  }

  render() {
    if (
      !this.state.texts ||
      !this.state.persistentData ||
      !this.state.settings
    ) {
      return (
        <IonContent>
          <div>Loading...</div>
        </IonContent>
      );
    }
    let textCards = this.state.texts
      .filter((textMeta, _idx) => {
        return (
          !this.state.categoryFilter ||
          textMeta.categories.includes(this.state.categoryFilter)
        );
      })
      .filter((textMeta, _idx) => {
        return (
          !this.state.difficultyFilter ||
          textMeta.difficulty.includes(this.state.difficultyFilter)
        );
      })
      .map((textMeta, idx) => {
        return (
          <TextCard
            textMeta={textMeta}
            key={idx}
            persistentData={
              this.state.persistentData!.has(textMeta.id)
                ? this.state.persistentData!.get(textMeta.id)!
                : new PersistentTextData(textMeta.id)
            }
            settings={this.state.settings!}
          />
        );
      });
    let categoryOptions = CATEGORIES.map((category, _idx) => {
      return (
        <IonSelectOption value={category} key={"selector-category-" + category}>
          {CATEGORY_MAP.get(category)}
        </IonSelectOption>
      );
    });
    let difficultyOptions = ["Easy", "Medium", "Hard"].map(
      (difficulty, _idx) => {
        return (
          <IonSelectOption
            value={difficulty}
            key={"selector-difficulty-" + difficulty}
          >
            {difficulty}
          </IonSelectOption>
        );
      }
    );

    return (
      <IonPage>
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel>Category</IonLabel>
              <IonSelect
                value={this.state.categoryFilter}
                placeholder="Any"
                interface="popover"
                onIonChange={(e) => this.setCategoryFilter(e.detail.value)}
              >
                <IonSelectOption value="" key={"selector-category-any"}>
                  Any
                </IonSelectOption>
                {categoryOptions}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>Difficulty</IonLabel>
              <IonSelect
                value={this.state.difficultyFilter}
                placeholder="Any"
                interface="popover"
                onIonChange={(e) => this.setDifficultyFilter(e.detail.value)}
              >
                <IonSelectOption value="" key={"selector-category-any"}>
                  Any
                </IonSelectOption>
                {difficultyOptions}
              </IonSelect>
            </IonItem>
          </IonList>
          {textCards}
        </IonContent>
      </IonPage>
    );
  }
}

export default LibraryPage;
