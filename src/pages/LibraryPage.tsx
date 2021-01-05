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
import { DAO, PersistentTextData } from "../common/DAO";

class LibraryPage extends React.Component<
  {},
  {
    texts?: Array<TextMeta>;
    categoryFilter?: string;
    difficultyFilter?: string;
    persistentData?: Map<string, PersistentTextData>;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      texts: undefined,
      categoryFilter: undefined,
      difficultyFilter: undefined,
      persistentData: undefined,
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
        return DAO.getAllTextData();
      })
      .then((persistentData) => {
        this.setState(() => ({
          persistentData: persistentData,
        }));
      });

    this.setCategoryFilter = this.setCategoryFilter.bind(this);
    this.setDifficultyFilter = this.setDifficultyFilter.bind(this);
  }

  setCategoryFilter(value: string) {
    this.setState((state) => ({
      categoryFilter: value,
    }));
  }

  setDifficultyFilter(value: string) {
    this.setState((state) => ({
      difficultyFilter: value,
    }));
  }

  render() {
    if (!this.state.texts || !this.state.persistentData) {
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