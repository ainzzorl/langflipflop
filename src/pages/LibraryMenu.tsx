import React from "react";
import "./LibraryMenu.css";

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

class LibraryMenu extends React.Component<
  {},
  {
    texts?: Array<TextMeta>;
    categoryFilter?: string;
    difficultyFilter?: string;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      texts: undefined,
      categoryFilter: undefined,
      difficultyFilter: undefined,
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
    if (!this.state.texts) {
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
        return <TextCard textMeta={textMeta} />;
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

export default LibraryMenu;
