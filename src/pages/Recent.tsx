import React from "react";
import "./Recent.css";

import { IonContent, IonPage } from "@ionic/react";

import TextMeta from "../common/TextMeta";

import TextCard from "../components/TextCard";

import { DAO, PersistentTextData } from "../common/DAO";

class Recent extends React.Component<
  {},
  {
    texts?: Array<TextMeta>;
    textsPersistentData?: Map<string, PersistentTextData>;
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
        return DAO.getAllTextData();
      })
      .then((textsData) => {
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
            textsData.get(t2.id)!.lastOpenedTimestamp! -
            textsData.get(t1.id)!.lastOpenedTimestamp!
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
      return (
        <TextCard
          textMeta={textMeta}
          key={idx}
          persistentData={
            this.state.textsPersistentData!.has(textMeta.id)
              ? this.state.textsPersistentData!.get(textMeta.id)!
              : new PersistentTextData(textMeta.id)
          }
        />
      );
    });
    return (
      <IonPage>
        <IonContent>
          {textCards}
          <div data-testid="rendered-indicator" />
        </IonContent>
      </IonPage>
    );
  }
}

export default Recent;
