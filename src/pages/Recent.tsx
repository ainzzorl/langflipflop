import React from "react";
import "./Recent.css";

import { Plugins } from "@capacitor/core";
import { IonContent, IonPage } from "@ionic/react";

import TextMeta from "../common/TextMeta";

import TextCard from "../components/TextCard";

const { Storage } = Plugins;

// TODO: move to shared file
class TextPersistentData {
  id: string;
  lastOpenedTimestamp: number;

  constructor(id: string, data: any) {
    this.id = id;
    this.lastOpenedTimestamp = data["lastOpenedTimestamp"];
  }
}

class Recent extends React.Component<
  {},
  {
    texts?: Array<TextMeta>;
    textsPersistentData?: Map<string, TextPersistentData>;
    sortedTexts?: Array<TextMeta>;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      texts: undefined,
      textsPersistentData: undefined,
      sortedTexts: undefined,
    };

    // TODO: refactor duplication with LibraryMenu
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
        this.setState((state) => ({
          texts: textMetas,
        }));
        return Storage.get({ key: "text-data" });
      })
      .then((value) => {
        const s = value.value;
        let textsData: Map<string, TextPersistentData> = new Map<
          string,
          TextPersistentData
        >();
        if (s !== null) {
          textsData = new Map(Object.entries(JSON.parse(s)));
        }
        let openedTexts: Array<TextMeta> = this.state.texts!.filter(
          (textMeta) => {
            return (
              textsData.has(textMeta.id) &&
              textsData.get(textMeta.id)?.lastOpenedTimestamp
            );
          }
        );
        openedTexts.sort(
          (t1: TextMeta, t2: TextMeta) =>
            textsData.get(t2.id)!.lastOpenedTimestamp -
            textsData.get(t1.id)!.lastOpenedTimestamp
        );
        this.setState((state) => ({
          textsPersistentData: textsData,
          sortedTexts: openedTexts,
        }));
      });
  }

  render() {
    if (
      !this.state.texts ||
      !this.state.textsPersistentData ||
      !this.state.sortedTexts
    ) {
      return (
        <IonContent>
          <div>Loading...</div>
        </IonContent>
      );
    }

    let textCards = this.state.sortedTexts.map((textMeta, idx) => {
      return <TextCard textMeta={textMeta} key={idx} />;
    });
    return (
      <IonPage>
        <IonContent>{textCards}</IonContent>
      </IonPage>
    );
  }
}

export default Recent;
