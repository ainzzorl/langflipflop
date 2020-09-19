import React from "react";
import "./MyText.css";
import {
  IonButton,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
} from "@ionic/react";

import { RouteComponentProps } from "react-router-dom";
import { arrowBackOutline } from "ionicons/icons";

import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

interface MyTextProps
  extends RouteComponentProps<{
    id: string;
  }> {}

class MyText extends React.Component<
  MyTextProps,
  { lang: string; texts: any; sentenceIndex: number; title: String }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      lang: "en",
      texts: {},
      sentenceIndex: -1,
      title: "Durmstrang",
    };

    fetch("assets/data/texts/" + this.props.match.params.id + ".json")
      .then((res) => res.json())
      .then((res) => {
        this.setState((state) => ({
          texts: res,
        }));
      });

    Storage.get({ key: "text-data." + this.props.match.params.id }).then(
      (value) => {
        const s = value.value;
        if (s !== null) {
          let ps = JSON.parse(s);
          this.setState((state) => ({
            sentenceIndex: ps["sentenceIndex"],
          }));
        } else {
          this.setState((state) => ({
            sentenceIndex: 0,
          }));
        }
      }
    );

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
    this.persist = this.persist.bind(this);
  }

  persist() {
    Storage.set({
      key: "text-data." + this.props.match.params.id,
      value: JSON.stringify({
        sentenceIndex: this.state.sentenceIndex,
      }),
    });
  }

  goToNext() {
    this.setState(
      (state) => ({
        lang: "en",
        texts: state.texts,
        sentenceIndex: state.sentenceIndex + 1,
      }),
      this.persist
    );
  }

  goToPrevious() {
    this.setState(
      (state) => ({
        lang: "en",
        texts: state.texts,
        sentenceIndex: state.sentenceIndex - 1,
      }),
      this.persist
    );
  }

  render() {
    if (!this.state.texts["en"] || this.state.sentenceIndex < 0) {
      return <div>Loading...</div>;
    }
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <div>
              <IonButtons slot="start">
                <IonButton href="/mainmenu">
                  <IonIcon slot="start" icon={arrowBackOutline} />
                </IonButton>
                <span>{this.state.texts[this.state.lang].title}</span>
              </IonButtons>
            </div>
            <div>
              <span>
                Sentence #{this.state.sentenceIndex + 1}/
                {this.state.texts["en"].sentences.length}
              </span>
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div>
            <p
              onClick={() => {
                let newLang;
                if (this.state.lang === "en") {
                  newLang = "es";
                } else {
                  newLang = "en";
                }
                this.setState({
                  lang: newLang,
                  texts: this.state.texts,
                  sentenceIndex: this.state.sentenceIndex,
                });
              }}
            >
              {
                this.state.texts[this.state.lang].sentences[
                  this.state.sentenceIndex
                ]
              }
            </p>
            <IonButton
              disabled={this.state.sentenceIndex === 0}
              color="primary"
              onClick={this.goToPrevious}
            >
              {" "}
              Previous{" "}
            </IonButton>
            <IonButton
              disabled={
                this.state.sentenceIndex ===
                this.state.texts["en"].sentences.length - 1
              }
              color="secondary"
              onClick={this.goToNext}
            >
              {" "}
              Next{" "}
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

export default MyText;
