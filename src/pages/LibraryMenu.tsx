import React from "react";
import "./LibraryMenu.css";

import {
  IonContent,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
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

class LibraryMenu extends React.Component<{}, { texts?: Array<TextMeta> }> {
  constructor(props: any) {
    super(props);
    this.state = {
      texts: undefined,
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
  }

  render() {
    if (!this.state.texts) {
      return (
        <IonContent>
          <div>Loading...</div>
        </IonContent>
      );
    }

    let textCards = this.state.texts.map((textMeta, idx) => {
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

    return <IonContent>{textCards}</IonContent>;
  }
}

export default LibraryMenu;
