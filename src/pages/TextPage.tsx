import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonicSafeString,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Hammer from "hammerjs";
import { help, information } from "ionicons/icons";
import Mousetrap from "mousetrap";
import React from "react";
import ReactCardFlip from "react-card-flip";
import ReactDOMServer from "react-dom/server";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import { getQueryParams, getSearch, isBrowser } from "../common/Common";
import { DAO } from "../common/DAO";
import "./TextPage.css";

interface TextPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

class Text {
  title: string = "";
  description: string = "";
  segments: Array<string> = [];
}

class TextPage extends React.Component<
  TextPageProps,
  {
    currentLang: string; // the language of the side we are currently showing
    lang1: string; // aka "from" lang
    lang2: string; // aka "to" lang
    // Map lang -> Text
    texts: Map<string, Text>;
    segmentIndex: number;
    gesturesInitialized: boolean;
    sideOneText: string;
    sideTwoText: string;
    flipped: boolean;
    showFtue: boolean;
    showEndOfTextAlert: boolean;
  }
> {
  constructor(props: any) {
    super(props);

    let params = getQueryParams(props);

    this.state = {
      // TODO: the defaults take place sometimes when user clicks back and forward.
      // This is not good generally.
      // If it happens somehow, we should default to the persistent state/prefs.
      currentLang: (params["lang1"] as string) || "en",
      lang1: (params["lang1"] as string) || "en",
      lang2: (params["lang2"] as string) || "es",
      segmentIndex: parseInt((params["i"] as string) || "1") - 1,
      texts: new Map<string, Text>(),
      gesturesInitialized: false,
      sideOneText: "",
      sideTwoText: "",
      flipped: false,
      showFtue: false,
      showEndOfTextAlert: false,
    };

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
    this.onFlip = this.onFlip.bind(this);
    this.updateTextStamps = this.updateTextStamps.bind(this);
    this.completeFtue = this.completeFtue.bind(this);
    this.onHelpClicked = this.onHelpClicked.bind(this);
    this.onGoToTextInfoClicked = this.onGoToTextInfoClicked.bind(this);
    this.setShowEndOfTextAlert = this.setShowEndOfTextAlert.bind(this);

    this.load();
  }

  componentDidUpdate() {
    if (this.state?.texts?.has("en")) {
      document.title = this.state.texts.get("en")!.title;
    }

    this.initGestures();
  }

  componentDidMount() {
    Mousetrap.bind("space", () => this.onFlip());
    Mousetrap.bind("right", () => this.goToNext());
    Mousetrap.bind("left", () => this.goToPrevious());
  }

  componentWillUnmount() {
    Mousetrap.unbind("space");
    Mousetrap.unbind("right");
    Mousetrap.unbind("left");
  }

  render() {
    if (!this.state.texts.has("en") || this.state.segmentIndex < 0) {
      return <IonPage></IonPage>;
    }

    let ftueMessage;
    if (isBrowser()) {
      ftueMessage = new IonicSafeString(
        // TODO: internationalize
        ReactDOMServer.renderToString(
          <div>
            <p>
              Try translating the text you see on the screen and then click the
              text to see a possible translation.
            </p>
            <p>Click NEXT to go to the next screen.</p>
            <p>PREVIOUS to go to the previous screen.</p>
          </div>
        )
      );
    } else {
      // TODO: internationalize
      ftueMessage = new IonicSafeString(
        ReactDOMServer.renderToString(
          <div>
            <p>
              Try translating the text you see on the screen and then tap the
              text to see a possible translation.
            </p>
            <p>Swipe left or tap NEXT to go to the next screen.</p>
            <p>Swipe right or tap PREVIOUS to go to the previous screen.</p>
          </div>
        )
      );
    }

    return (
      <IonPage className="text-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" data-testid="back-button" />
              <IonTitle color="medium">
                <div className="my-wrap">
                  {this.state.texts.get(this.state.currentLang)!.title} (
                  {this.state.segmentIndex + 1}/
                  {this.state.texts.get("en")!.segments.length})
                </div>
              </IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent
          id="text-content"
          class="ion-padding"
          onClick={() => this.onFlip()}
        >
          <IonAlert
            isOpen={this.state.showEndOfTextAlert}
            onDidDismiss={() => this.setShowEndOfTextAlert(false)}
            header="End of Text" // TODO: internationalize
            buttons={[
              {
                text: "Home", // TODO: internationalize
                cssClass: "primary",
                handler: () => {
                  this.props.history.push("/t/texts");
                },
              },
              {
                text: "About Text", // TODO: internationalize
                cssClass: "secondary",
                handler: this.onGoToTextInfoClicked,
              },
              {
                text: "Close", // TODO: internationalize
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
            data-testid="text-ftue-alert"
            buttons={[
              {
                text: "OK",
                role: "cancel",
                handler: this.completeFtue,
              },
            ]}
          />
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                disabled={this.state.segmentIndex === 0}
                color="primary"
                onClick={this.goToPrevious}
              >
                <FormattedMessage id="text.previous" />
              </IonButton>
              <IonButton
                disabled={
                  this.state.segmentIndex ===
                  this.state.texts.get("en")!.segments.length - 1
                }
                color="secondary"
                onClick={this.goToNext}
              >
                <FormattedMessage id="text.next" />
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton
                data-testid="go-to-text-info-button"
                onClick={this.onGoToTextInfoClicked}
              >
                <IonIcon icon={information} size="large" />
              </IonButton>
              <IonButton onClick={this.onHelpClicked} data-testid="help-button">
                <IonIcon icon={help} size="large" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }

  private initGestures() {
    const element = document.getElementById("text-content");
    if (element !== null && !this.state.gesturesInitialized) {
      const hammertime = new Hammer(element);
      hammertime.on("swipeleft", (e) => {
        this.goToNext();
      });
      hammertime.on("swiperight", (e) => {
        this.goToPrevious();
      });
      this.setState(() => ({
        gesturesInitialized: true,
      }));
    }
  }

  private load() {
    this.loadTexts()
      .then((texts) => {
        this.setState((state) => ({
          texts: texts,
          sideOneText: texts.get(state.lang1)!.segments[state.segmentIndex],
          sideTwoText: texts.get(state.lang2)!.segments[state.segmentIndex],
        }));
        return DAO.getUser();
      })
      .then((user) => {
        this.setState({
          showFtue: !user.completedTextFtue,
        });
      })
      .then(() => {
        this.updateTextStamps();
      });
  }

  private async loadTexts() {
    const res = await fetch(
      `assets/data/texts/${this.props.match.params.id}.json`
    );
    const textsRaw = await res.json();
    let texts = new Map<string, Text>();
    Object.keys(textsRaw).forEach((lang) => {
      if (lang !== "meta") {
        let text = new Text();
        text.title = textsRaw[lang]["title"];
        text.description = textsRaw[lang]["description"];
        text.segments = textsRaw[lang]["segments"];
        texts.set(lang, text);
      }
    });
    return texts;
  }

  // TODO: generalize
  private otherLang(lang: string): string {
    return lang === "en" ? "es" : "en";
  }

  private updateTextStamps() {
    let textId = this.props.match.params.id;
    DAO.updateTextStamps(textId, this.state.segmentIndex);
  }

  private onFlip() {
    this.setState((state) => ({
      currentLang: this.otherLang(this.state.currentLang),
      flipped: !this.state.flipped,
    }));
  }

  private goToNext() {
    this.goToIndex(this.state.segmentIndex + 1);
  }

  private goToPrevious() {
    this.goToIndex(this.state.segmentIndex - 1);
  }

  private onGoToTextInfoClicked() {
    this.props.history.push(
      `/texts/${this.props.match.params.id}/info${getSearch(this.props)}`
    );
  }

  private completeFtue() {
    this.setState(() => ({
      showFtue: false,
    }));
    DAO.getUser().then((user) => {
      user.completedTextFtue = true;
      DAO.setUser(user);
    });
  }

  private setShowEndOfTextAlert(value: boolean) {
    this.setState(() => ({
      showEndOfTextAlert: value,
    }));
  }

  private onHelpClicked() {
    this.setState(() => ({
      showFtue: true,
    }));
  }

  private goToIndex(index: number) {
    if (index < 0) {
      return;
    }
    if (index >= this.state.texts.get("en")!.segments.length) {
      this.setShowEndOfTextAlert(true);
      return;
    }
    this.setState(
      (state) => ({
        currentLang: state.lang1,
        segmentIndex: index,
        sideOneText: state.flipped
          ? state.texts.get(state.lang2)!.segments[index]
          : state.texts.get(state.lang1)!.segments[index],
        sideTwoText: state.flipped
          ? state.texts.get(state.lang1)!.segments[index]
          : state.texts.get(state.lang2)!.segments[index],
      }),
      this.updateTextStamps
    );
    if (window.history.replaceState) {
      let searchParams = new URLSearchParams(getSearch(this.props));
      searchParams.set("i", (index + 1).toString());
      var newURL =
        window.location.origin +
        window.location.pathname +
        "?" +
        searchParams.toString();
      window.history.replaceState({ path: newURL }, "", newURL);
    }
  }
}

export default TextPage;
