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
    recentTexts?: Array<TextMeta>;
    settings?: Settings;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      texts: undefined,
      textsPersistentData: undefined,
      recentTexts: undefined,
      settings: undefined,
    };

    loadAllTextMetadata().then((metadata) => {
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

  render() {
    if (
      !this.state.texts ||
      !this.state.textsPersistentData ||
      !this.state.recentTexts ||
      !this.state.settings
    ) {
      return (
        <IonPage>
          <IonContent></IonContent>
        </IonPage>
      );
    }

    let content;

    if (this.state.recentTexts!.length > 0) {
      content = this.state.recentTexts.map((textMeta, idx) => {
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

  private loadPersistentData() {
    if (!this.state.texts) {
      return;
    }
    DAO.getSettings().then((settings) => {
      DAO.getAllTextData().then((textsData) => {
        let recentTexts = this.getRecentTexts(textsData);

        // Update state only if something actually changed,
        // otherwise it can get stuck updating itself indefinitely.
        if (
          !deepEqual(this.state.textsPersistentData, textsData) ||
          !deepEqual(this.state.recentTexts, recentTexts) ||
          !deepEqual(this.state.settings, settings)
        ) {
          this.setState(() => ({
            textsPersistentData: textsData,
            recentTexts: recentTexts,
            settings: settings,
          }));
        }
      });
    });
  }

  private getRecentTexts(allTextData: Map<String, PersistentTextData>) {
    let openedTexts: Array<TextMeta> = this.state.texts!.filter((textMeta) => {
      return (
        allTextData.has(textMeta.id) &&
        allTextData.get(textMeta.id)?.lastOpenedTimestamp
      );
    });
    openedTexts.sort(
      (t1: TextMeta, t2: TextMeta) =>
        allTextData.get(t2.id)!.lastOpenedTimestamp! -
        allTextData.get(t1.id)!.lastOpenedTimestamp!
    );
    return openedTexts;
  }
}

export default RecentPage;
