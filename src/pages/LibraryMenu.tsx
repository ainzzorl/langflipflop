import React from "react";
import "./LibraryMenu.css";

import {
  IonContent,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonPage,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

class TextMeta {
  id: string;
  title: string;
  difficulty: number;
  categories: Array<string>;

  constructor(data: any) {
    this.title = data["en"]["title"];
    this.id = data["meta"]["id"];
    this.difficulty = data["meta"]["difficulty"];
    this.categories = data["meta"]["categories"];
  }
}

class LibraryMenu extends React.Component<
  {},
  {
    texts?: Array<TextMeta>;
    allCategories: Array<String>;
    categoryFilter?: string;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      texts: undefined,
      categoryFilter: undefined,
      allCategories: [],
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
        let allc = new Set<string>();
        textMetas.forEach((textMeta) => {
          textMeta.categories.forEach((c) => {
            allc.add(c);
          });
        });
        let allCategories = Array.from(allc).sort();
        this.setState((state) => ({
          texts: textMetas,
          allCategories: allCategories,
        }));
      });

    this.setCategoryFilter = this.setCategoryFilter.bind(this);
  }

  setCategoryFilter(value: string) {
    this.setState((state) => ({
      categoryFilter: value,
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
      .map((textMeta, idx) => {
        let routerLink = "/texts/" + textMeta.id;
        return (
          <li key={idx}>
            <IonCard button routerLink={routerLink}>
              <IonCardHeader>
                <IonCardTitle>
                  <IonLabel>{textMeta.title}</IonLabel>
                </IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <p>Difficulty: {textMeta.difficulty}</p>
                <p>Categories: {textMeta.categories.join(", ")}</p>
                <p>Length: Car</p>
              </IonCardContent>
            </IonCard>
          </li>
        );
      });
    let categoryOptions = this.state.allCategories.map((category, _idx) => {
      return (
        <IonSelectOption value={category} key={"selector-category-" + category}>
          {category}
        </IonSelectOption>
      );
    });

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
          </IonList>
          {textCards}
        </IonContent>
      </IonPage>
    );
  }
}

export default LibraryMenu;
