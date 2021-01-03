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

import Hammer from "hammerjs";

import { information } from "ionicons/icons";

import ReactCardFlip from "react-card-flip";
import { DAO } from "../common/DAO";

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
    sideOneText: string;
    sideTwoText: string;
    flipped: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    let initialLang = "en";
    this.state = {
      lang: initialLang,
      texts: {},
      sentenceIndex: -1,
      gesturesInitialized: false,
      showInfoAlert: false,
      sideOneText: "",
      sideTwoText: "",
      flipped: false,
    };

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
    this.setShowInfoAlert = this.setShowInfoAlert.bind(this);
    this.onFlip = this.onFlip.bind(this);
    this.updateTextStamps = this.updateTextStamps.bind(this);

    fetch("assets/data/texts/" + this.props.match.params.id + ".json")
      .then((res) => res.json())
      .then((res) => {
        this.setState((state) => ({
          texts: res,
        }));
        return DAO.getAllTextData();
      })
      .then((persistentData) => {
        let sentenceIndex: number;
        if (persistentData.has(this.props.match.params.id)) {
          sentenceIndex = persistentData.get(this.props.match.params.id)!
            .currentIndex;
        } else {
          sentenceIndex = 0;
        }
        this.setState((state) => ({
          sentenceIndex: sentenceIndex,
          sideOneText: state.texts[initialLang].sentences[sentenceIndex],
          sideTwoText:
            state.texts[this.otherLang(initialLang)].sentences[sentenceIndex],
        }));
        this.updateTextStamps();
      });
  }

  otherLang(lang: string): string {
    return lang === "en" ? "es" : "en";
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

  updateTextStamps() {
    let textId = this.props.match.params.id;
    DAO.updateTextStamps(textId, this.state.sentenceIndex);
  }

  setShowInfoAlert(value: boolean) {
    this.setState((state) => ({
      showInfoAlert: value,
    }));
  }

  onFlip() {
    let newLang: string;
    if (this.state.lang === "en") {
      newLang = "es";
    } else {
      newLang = "en";
    }
    this.setState((state) => ({
      lang: newLang,
      flipped: !this.state.flipped,
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
        sideOneText: state.flipped
          ? state.texts["es"].sentences[state.sentenceIndex + 1]
          : state.texts["en"].sentences[state.sentenceIndex + 1],
        sideTwoText: state.flipped
          ? state.texts["en"].sentences[state.sentenceIndex + 1]
          : state.texts["es"].sentences[state.sentenceIndex + 1],
      }),
      this.updateTextStamps
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
        sideOneText: state.flipped
          ? state.texts["es"].sentences[state.sentenceIndex - 1]
          : state.texts["en"].sentences[state.sentenceIndex - 1],
        sideTwoText: state.flipped
          ? state.texts["en"].sentences[state.sentenceIndex - 1]
          : state.texts["es"].sentences[state.sentenceIndex - 1],
      }),
      this.updateTextStamps
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
          {/* TODO: fix, use "pretty" */}
          <p>Categories: {this.state.texts.meta["categories"].join(", ")}</p>
          <p>{this.state.texts[this.state.lang]["description"]}</p>
        </div>
      )
    );
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton href="/">
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
          <ReactCardFlip
            isFlipped={this.state.flipped}
            flipDirection="horizontal"
          >
            <p onClick={() => this.onFlip()}>{this.state.sideOneText}</p>
            <p onClick={() => this.onFlip()}>{this.state.sideTwoText}</p>
          </ReactCardFlip>
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
