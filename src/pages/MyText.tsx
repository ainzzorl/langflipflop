import React from "react";
import ReactDOMServer from "react-dom/server";
import "./MyText.css";
import {
  IonAlert,
  IonButton,
  IonContent,
  IonFooter,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonIcon,
  IonicSafeString,
} from "@ionic/react";

import { RouteComponentProps } from "react-router-dom";
import { arrowBackOutline } from "ionicons/icons";

import { Plugins } from "@capacitor/core";

import Hammer from "hammerjs";

import { information } from "ionicons/icons";

const { Storage } = Plugins;

interface MyTextProps
  extends RouteComponentProps<{
    id: string;
  }> {}

class MyText extends React.Component<
  MyTextProps,
  {
    lang: string;
    texts: any;
    sentenceIndex: number;
    gesturesInitialized: boolean;
    showInfoAlert: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      lang: "en",
      texts: {},
      sentenceIndex: -1,
      gesturesInitialized: false,
      showInfoAlert: false,
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
    this.setShowInfoAlert = this.setShowInfoAlert.bind(this);
  }

  componentDidUpdate() {
    const element = document.getElementById("my-div");
    if (element !== null && !this.state.gesturesInitialized) {
      const hammertime = new Hammer(element);
      hammertime.on("swipeleft", (e) => {
        this.goToNext();
      });
      hammertime.on("swiperight", (e) => {
        this.goToPrevious();
      });
      this.setState((state) => ({
        gesturesInitialized: true,
      }));
    }
  }

  persist() {
    Storage.set({
      key: "text-data." + this.props.match.params.id,
      value: JSON.stringify({
        sentenceIndex: this.state.sentenceIndex,
      }),
    });
  }

  setShowInfoAlert(value: boolean) {
    this.setState((state) => ({
      showInfoAlert: value,
    }));
  }

  goToNext() {
    if (
      this.state.sentenceIndex >=
      this.state.texts["en"].sentences.length - 1
    ) {
      return;
    }
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
    if (this.state.sentenceIndex <= 0) {
      return;
    }
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

    let infoMessage = new IonicSafeString(
      ReactDOMServer.renderToString(
        <div>
          <p>Difficulty: {this.state.texts.meta["difficulty"]}</p>
          <p>Categories: {this.state.texts.meta["categories"].join(", ")}</p>
        </div>
      )
    );
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton href="/mainmenu">
                <IonIcon slot="start" icon={arrowBackOutline} />
              </IonButton>
              <IonTitle>
                <div id="my-wrap">
                  {this.state.texts[this.state.lang].title} (
                  {this.state.sentenceIndex + 1}/
                  {this.state.texts["en"].sentences.length})
                </div>
              </IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent id="my-div" class="ion-padding">
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
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
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
            </IonButtons>
            <IonButtons slot="end">
              <IonButton onClick={() => this.setShowInfoAlert(true)}>
                <IonIcon icon={information} size="large" />
              </IonButton>
            </IonButtons>
          </IonToolbar>

          <IonAlert
            isOpen={this.state.showInfoAlert}
            onDidDismiss={() => this.setShowInfoAlert(false)}
            header={"Text Info"}
            message={infoMessage}
            buttons={["OK"]}
          />
        </IonFooter>
      </IonPage>
    );
  }
}

export default MyText;
