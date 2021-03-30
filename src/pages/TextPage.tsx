import React from "react";
import ReactDOMServer from "react-dom/server";
import "./TextPage.css";
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
  IonAlert,
  IonicSafeString,
} from "@ionic/react";

import { RouteComponentProps } from "react-router-dom";

import Hammer from "hammerjs";

import { information, help } from "ionicons/icons";

import ReactCardFlip from "react-card-flip";
import { DAO, Settings } from "../common/DAO";

interface MyTextProps
  extends RouteComponentProps<{
    id: string;
  }> {}

class RecentPage extends React.Component<
  MyTextProps,
  {
    lang: string;
    initialLanguage: string;
    texts: any;
    sentenceIndex: number;
    gesturesInitialized: boolean;
    sideOneText: string;
    sideTwoText: string;
    flipped: boolean;
    settings?: Settings;
    showFtue: boolean;
    showEndOfTextAlert: boolean;
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
      sideOneText: "",
      sideTwoText: "",
      flipped: false,
      settings: undefined,
      showFtue: false,
      showEndOfTextAlert: false,
    };

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
    this.onFlip = this.onFlip.bind(this);
    this.updateTextStamps = this.updateTextStamps.bind(this);
    this.completeFtue = this.completeFtue.bind(this);
    this.onHelpClicked = this.onHelpClicked.bind(this);
    this.setShowEndOfTextAlert = this.setShowEndOfTextAlert.bind(this);

    fetch("assets/data/texts/" + this.props.match.params.id + ".json")
      .then((res) => res.json())
      .then((res) => {
        this.setState((_state) => ({
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
        return DAO.getUser();
      })
      .then((user) => {
        this.setState({
          showFtue: !user.completedTextFtue,
        });
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

  onFlip() {
    this.setState((state) => ({
      lang: this.otherLang(this.state.lang),
      flipped: !this.state.flipped,
    }));
  }

  goToNext() {
    this.goToIndex(this.state.sentenceIndex + 1);
  }

  goToPrevious() {
    this.goToIndex(this.state.sentenceIndex - 1);
  }

  completeFtue() {
    this.setState(() => ({
      showFtue: false,
    }));
    DAO.getUser().then((user) => {
      user.completedTextFtue = true;
      DAO.setUser(user);
    });
  }

  setShowEndOfTextAlert(value: boolean) {
    this.setState(() => ({
      showEndOfTextAlert: value,
    }));
  }

  onHelpClicked() {
    this.setState(() => ({
      showFtue: true,
    }));
  }

  goToIndex(index: number) {
    if (index < 0) {
      return;
    }
    if (index >= this.state.texts["en"].sentences.length) {
      this.setShowEndOfTextAlert(true);
      return;
    }
    this.setState(
      (state) => ({
        lang: state.initialLanguage,
        sentenceIndex: index,
        sideOneText: state.flipped
          ? state.texts[this.otherLang(state.initialLanguage)].sentences[index]
          : state.texts[state.initialLanguage].sentences[index],
        sideTwoText: state.flipped
          ? state.texts[state.initialLanguage].sentences[index]
          : state.texts[this.otherLang(state.initialLanguage)].sentences[index],
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

    let ftueMessage = new IonicSafeString(
      ReactDOMServer.renderToString(
        <div>
          <p>
            Try translating the text you see on the screen and then tap the text
            to see a possible translation.
          </p>
          <p>Swipe left or tap NEXT to go to the next screen.</p>
          <p>Swipe right or tap PREVIOUS to go to the previous screen.</p>
        </div>
      )
    );

    return (
      <IonPage className="text-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
              <IonTitle color="medium">
                <div className="my-wrap">
                  {this.state.texts[this.state.lang].title} (
                  {this.state.sentenceIndex + 1}/
                  {this.state.texts["en"].sentences.length})
                </div>
              </IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent
          id="my-div"
          class="ion-padding"
          onClick={() => this.onFlip()}
        >
          <IonAlert
            isOpen={this.state.showEndOfTextAlert}
            onDidDismiss={() => this.setShowEndOfTextAlert(false)}
            header="End of Text"
            buttons={[
              {
                text: "Home",
                cssClass: "primary",
                handler: () => {
                  this.props.history.push("/tabs/library");
                },
              },
              {
                text: "About Text",
                cssClass: "secondary",
                handler: () => {
                  this.props.history.push(
                    "/text-infos/" + this.props.match.params.id
                  );
                },
              },
              {
                text: "Close",
                role: "cancel",
                cssClass: "secondary",
              },
            ]}
          />

          <ReactCardFlip
            isFlipped={this.state.flipped}
            flipDirection="horizontal"
          >
            <p>{this.state.sideOneText}</p>
            <p>{this.state.sideTwoText}</p>
          </ReactCardFlip>

          <IonAlert
            isOpen={this.state.showFtue}
            onDidDismiss={() => this.completeFtue()}
            message={ftueMessage}
            buttons={["OK"]}
          />
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                disabled={this.state.sentenceIndex === 0}
                color="primary"
                onClick={this.goToPrevious}
              >
                Previous
              </IonButton>
              <IonButton
                disabled={
                  this.state.sentenceIndex ===
                  this.state.texts["en"].sentences.length - 1
                }
                color="secondary"
                onClick={this.goToNext}
              >
                Next
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton href={"/text-infos/" + this.props.match.params.id}>
                <IonIcon icon={information} size="large" />
              </IonButton>
              <IonButton onClick={this.onHelpClicked}>
                <IonIcon icon={help} size="large" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}

export default RecentPage;
