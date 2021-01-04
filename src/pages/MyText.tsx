import React from "react";
import "./MyText.css";
import {
  IonBackButton,
  IonButton,
  IonContent,
  IonFooter,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonIcon,
} from "@ionic/react";

import { RouteComponentProps } from "react-router-dom";

import Hammer from "hammerjs";

import { information } from "ionicons/icons";

import ReactCardFlip from "react-card-flip";
import { DAO, Settings } from "../common/DAO";

interface MyTextProps
  extends RouteComponentProps<{
    id: string;
  }> {}

class MyText extends React.Component<
  MyTextProps,
  {
    lang: string;
    initialLanguage: string;
    texts: any;
    sentenceIndex: number;
    gesturesInitialized: boolean;
    showInfoAlert: boolean;
    sideOneText: string;
    sideTwoText: string;
    flipped: boolean;
    settings?: Settings;
  }
> {
  constructor(props: any) {
    super(props);
    let initialLang = "en";
    this.state = {
      lang: initialLang,
      initialLanguage: initialLang,
      texts: {},
      sentenceIndex: -1,
      gesturesInitialized: false,
      showInfoAlert: false,
      sideOneText: "",
      sideTwoText: "",
      flipped: false,
      settings: undefined,
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
        this.setState(() => ({
          sentenceIndex: sentenceIndex,
        }));
        this.updateTextStamps();
        return DAO.getSettings();
      })
      .then((settings) => {
        let initialLang: string = "";
        if (settings.translationDirection === "en-es") {
          initialLang = "en";
        } else {
          initialLang = "es";
        }
        this.setState((state) => ({
          settings: settings,
          lang: initialLang,
          initialLanguage: initialLang,
          sideOneText: state.texts[initialLang].sentences[state.sentenceIndex],
          sideTwoText:
            state.texts[this.otherLang(initialLang)].sentences[
              state.sentenceIndex
            ],
        }));
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
    this.setState((state) => ({
      lang: this.otherLang(this.state.lang),
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
        lang: state.initialLanguage,
        texts: state.texts,
        sentenceIndex: state.sentenceIndex + 1,
        sideOneText: state.flipped
          ? state.texts[this.otherLang(state.initialLanguage)].sentences[
              state.sentenceIndex + 1
            ]
          : state.texts[state.initialLanguage].sentences[
              state.sentenceIndex + 1
            ],
        sideTwoText: state.flipped
          ? state.texts[state.initialLanguage].sentences[
              state.sentenceIndex + 1
            ]
          : state.texts[this.otherLang(state.initialLanguage)].sentences[
              state.sentenceIndex + 1
            ],
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
        lang: state.initialLanguage,
        texts: state.texts,
        sentenceIndex: state.sentenceIndex - 1,
        sideOneText: state.flipped
          ? state.texts[this.otherLang(state.initialLanguage)].sentences[
              state.sentenceIndex - 1
            ]
          : state.texts[state.initialLanguage].sentences[
              state.sentenceIndex - 1
            ],
        sideTwoText: state.flipped
          ? state.texts[state.initialLanguage].sentences[
              state.sentenceIndex - 1
            ]
          : state.texts[this.otherLang(state.initialLanguage)].sentences[
              state.sentenceIndex - 1
            ],
      }),
      this.updateTextStamps
    );
  }

  render() {
    if (
      !this.state.texts["en"] ||
      this.state.sentenceIndex < 0 ||
      !this.state.settings
    ) {
      return <div>Loading...</div>;
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
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
              <IonButton href={"/text-infos/" + this.props.match.params.id}>
                <IonIcon icon={information} size="large" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}

export default MyText;
