import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import deepEqual from "fast-deep-equal/es6";
import React from "react";
import { loadAllTextMetadata } from "../common/Common";
import { DAO, PersistentTextData, Settings } from "../common/DAO";
import TextMeta from "../common/TextMeta";
import TextCard from "../components/TextCard";

class RecentPage extends React.Component<
  {},
  {
    texts?: Array<TextMeta>;
    textsPersistentData?: Map<string, PersistentTextData>;
    sortedTexts?: Array<TextMeta>;
    settings?: Settings;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      texts: undefined,
      textsPersistentData: undefined,
      sortedTexts: undefined,
      settings: undefined,
    };

    loadAllTextMetadata().then((metadata) => {
      let allc = new Set<string>();
      metadata.forEach((metadata) => {
        metadata.categories.forEach((c) => {
          allc.add(c);
        });
      });
      this.setState(() => ({
        texts: metadata,
      }));
    });

    this.loadPersistentData = this.loadPersistentData.bind(this);
  }

  componentDidMount() {
    this.loadPersistentData();
  }

  componentDidUpdate() {
    this.loadPersistentData();
  }

  loadPersistentData() {
    if (!this.state.texts) {
      return;
    }
    DAO.getSettings().then((settings) => {
      DAO.getAllTextData().then((textsData) => {
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

        if (
          !deepEqual(this.state.textsPersistentData, textsData) ||
          !deepEqual(this.state.sortedTexts, openedTexts) ||
          !deepEqual(this.state.settings, settings)
        ) {
          this.setState(() => ({
            textsPersistentData: textsData,
            sortedTexts: openedTexts,
            settings: settings,
          }));
        }
      });
    });
  }

  render() {
    if (
      !this.state.texts ||
      !this.state.textsPersistentData ||
      !this.state.sortedTexts ||
      !this.state.settings
    ) {
      return (
        <IonPage>
          <IonContent></IonContent>{" "}
        </IonPage>
      );
    }

    let content;

    if (this.state.sortedTexts!.length > 0) {
      content = this.state.sortedTexts.map((textMeta, idx) => {
        return (
          <TextCard
            textMeta={textMeta}
            key={idx}
            persistentData={
              this.state.textsPersistentData!.has(textMeta.id)
                ? this.state.textsPersistentData!.get(textMeta.id)!
                : new PersistentTextData(textMeta.id)
            }
            settings={this.state.settings!}
          />
        );
      });
    } else {
      content = <p className="content-text">No recently opened texts.</p>;
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Recent</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {content}
          <div data-testid="rendered-indicator" />
        </IonContent>
      </IonPage>
    );
  }
}

export default RecentPage;
