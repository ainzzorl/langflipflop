import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonicSafeString,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Hammer from "hammerjs";
import {
  help,
  information,
  thumbsDown,
  thumbsDownOutline,
  thumbsUp,
  thumbsUpOutline,
} from "ionicons/icons";
import Mousetrap from "mousetrap";
import React from "react";
import ReactCardFlip from "react-card-flip";
import ReactDOMServer from "react-dom/server";
import ReactGA from "react-ga";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import {
  getLocaleMessages,
  getQueryParams,
  getSearch,
  isBrowser,
  isLocalhost,
} from "../common/Common";
import { DAO, SegmentFeedback } from "../common/DAO";
import { dataVersion as version } from "../common/versions.json";
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
    showFeedbackModal: boolean;
    // Map segmentIndex -> SegmentFeedback
    feedbacks: any;
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
      showFeedbackModal: false,
      feedbacks: {},
    };

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
    this.onFlip = this.onFlip.bind(this);
    this.updateTextStamps = this.updateTextStamps.bind(this);
    this.completeFtue = this.completeFtue.bind(this);
    this.onHelpClicked = this.onHelpClicked.bind(this);
    this.onGoToTextInfoClicked = this.onGoToTextInfoClicked.bind(this);
    this.setShowEndOfTextAlert = this.setShowEndOfTextAlert.bind(this);
    this.onGoToBeginningClicked = this.onGoToBeginningClicked.bind(this);
    this.onFeedbackUpClicked = this.onFeedbackUpClicked.bind(this);
    this.onFeedbackDownClicked = this.onFeedbackDownClicked.bind(this);
    this.onFeedbackModalDismissed = this.onFeedbackModalDismissed.bind(this);
    this.getFeedback = this.getFeedback.bind(this);

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
      return (
        <IonPage>
          <IonContent>
            <IonSpinner />
          </IonContent>
        </IonPage>
      );
    }

    let ftueMessage;
    let localeMessages = getLocaleMessages();
    if (isBrowser()) {
      ftueMessage = new IonicSafeString(
        ReactDOMServer.renderToString(
          <div>
            <p>{localeMessages["text.browser-ftue-p1"]}</p>
            <p>{localeMessages["text.browser-ftue-p2"]}</p>
            <p>{localeMessages["text.browser-ftue-p3"]}</p>
          </div>
        )
      );
    } else {
      ftueMessage = new IonicSafeString(
        ReactDOMServer.renderToString(
          <div>
            <p>{localeMessages["text.device-ftue-p1"]}</p>
            <p>{localeMessages["text.device-ftue-p2"]}</p>
            <p>{localeMessages["text.device-ftue-p3"]}</p>
          </div>
        )
      );
    }

    return (
      <IonPage className="text-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/t/texts" data-testid="back-button" />
            </IonButtons>
            <IonTitle color="medium">
              <div className="my-wrap">
                {this.state.texts.get(this.state.currentLang)!.title} (
                {this.state.segmentIndex + 1}/
                {this.state.texts.get("en")!.segments.length})
              </div>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonAlert
          isOpen={this.state.showEndOfTextAlert}
          onDidDismiss={() => this.setShowEndOfTextAlert(false)}
          header={localeMessages["text.end-of-text-alert-header"]}
          buttons={[
            {
              text: localeMessages["text.end-of-text-alert-home"],
              cssClass: "primary",
              handler: () => {
                this.props.history.push("/t/texts");
              },
            },
            {
              text: localeMessages["text.end-of-text-alert-about-text"],
              cssClass: "secondary",
              handler: this.onGoToTextInfoClicked,
            },
            {
              text: localeMessages["text.end-of-text-alert-go-to-beginning"],
              cssClass: "secondary",
              handler: this.onGoToBeginningClicked,
            },
            {
              text: localeMessages["text.end-of-text-alert-close"],
              role: "cancel",
              cssClass: "secondary",
            },
          ]}
        />

        <IonModal
          isOpen={this.state.showFeedbackModal}
          onDidDismiss={this.onFeedbackModalDismissed}
        >
          <IonContent>
            <IonToolbar>
              <IonTitle>
                <IonText>
                  <FormattedMessage id="text.feedback-header" />
                </IonText>
              </IonTitle>
            </IonToolbar>
            <IonList>
              <IonItemDivider></IonItemDivider>
              <IonItem>
                <IonLabel>
                  <FormattedMessage id="text.feedback-bad-translation" />
                </IonLabel>
                <IonCheckbox
                  checked={this.getFeedback().checkboxes["bad-translation"]}
                  onIonChange={(e) =>
                    this.setFeedbackCheckbox(
                      "bad-translation",
                      e.detail.checked
                    )
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel>
                  <FormattedMessage id="text.feedback-not-interesting" />
                </IonLabel>
                <IonCheckbox
                  checked={
                    this.getFeedback().checkboxes["text-not-interesting"]
                  }
                  onIonChange={(e) =>
                    this.setFeedbackCheckbox(
                      "text-not-interesting",
                      e.detail.checked
                    )
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel>
                  <FormattedMessage id="text.feedback-mistakes-in-the-text" />
                </IonLabel>
                <IonCheckbox
                  checked={
                    this.getFeedback().checkboxes["mistakes-in-the-text"]
                  }
                  onIonChange={(e) =>
                    this.setFeedbackCheckbox(
                      "mistakes-in-the-text",
                      e.detail.checked
                    )
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel>
                  <FormattedMessage id="text.feedback-bugs" />
                </IonLabel>
                <IonCheckbox
                  checked={this.getFeedback().checkboxes["bugs"]}
                  onIonChange={(e) =>
                    this.setFeedbackCheckbox("bugs", e.detail.checked)
                  }
                />
              </IonItem>
              <IonItemDivider></IonItemDivider>
              <IonItem>
                <IonTextarea
                  placeholder={
                    localeMessages["text.feedback-text-area-placeholder"]
                  }
                  value={this.getFeedback().text}
                  onIonChange={(e) => this.setFeedbackText(e.detail.value!)}
                ></IonTextarea>
              </IonItem>
            </IonList>
          </IonContent>
          <IonFooter>
            <IonToolbar>
              <IonButtons>
                <IonButton
                  onClick={async () => {
                    this.onFeedbackModalDismissed();
                    await this.submitFeedback();
                  }}
                  slot="primary"
                  color="primary"
                  size="large"
                >
                  <FormattedMessage id="text.feedback-send" />
                </IonButton>
                <IonButton
                  onClick={() => this.onFeedbackModalDismissed()}
                  slot="secondary"
                  color="secondary"
                  size="large"
                >
                  <FormattedMessage id="text.feedback-cancel" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonFooter>
        </IonModal>

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
        <IonContent
          id="text-content"
          class="ion-padding"
          onClick={() => this.onFlip()}
        >
          <ReactCardFlip
            isFlipped={this.state.flipped}
            flipDirection="horizontal"
          >
            <p>{this.state.sideOneText}</p>
            <p>{this.state.sideTwoText}</p>
          </ReactCardFlip>
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
                data-testid="feedback-up"
                onClick={this.onFeedbackUpClicked}
              >
                <IonIcon
                  icon={
                    this.state.feedbacks[this.state.segmentIndex]?.rating ===
                    SegmentFeedback.RATING_UP
                      ? thumbsUp
                      : thumbsUpOutline
                  }
                  size="large"
                />
              </IonButton>
              <IonButton
                data-testid="feedback-down"
                onClick={this.onFeedbackDownClicked}
              >
                <IonIcon
                  icon={
                    this.state.feedbacks[this.state.segmentIndex]?.rating ===
                    SegmentFeedback.RATING_DOWN
                      ? thumbsDown
                      : thumbsDownOutline
                  }
                  size="large"
                />
              </IonButton>
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
        return DAO.getTextData(this.props.match.params.id);
      })
      .then((textData) => {
        this.setState(() => ({
          feedbacks: textData && textData.feedbacks ? textData.feedbacks : {},
        }));
        this.updateTextStamps();
      });
  }

  private async loadTexts() {
    const res = await fetch(
      `assets/data/texts/${this.props.match.params.id}-${version}.json`
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

  private otherLang(lang: string): string {
    return lang === this.state.lang1 ? this.state.lang2 : this.state.lang1;
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

  private onFeedbackUpClicked() {
    this.setState(
      (state) => {
        let feedback = this.getFeedback();
        if (feedback.rating === SegmentFeedback.RATING_UP) {
          feedback.rating = SegmentFeedback.RATING_UNDEFINED;
        } else {
          feedback.rating = SegmentFeedback.RATING_UP;
        }
        state.feedbacks[state.segmentIndex] = feedback;
        return {
          feedbacks: state.feedbacks,
        };
      },
      async () => {
        await DAO.updateSegmentFeedback(
          this.props.match.params.id,
          this.state.segmentIndex,
          this.getFeedback()
        );
        this.submitFeedback();
      }
    );
  }

  private onFeedbackDownClicked() {
    this.setState(
      (state) => {
        let feedback = this.getFeedback();
        if (feedback.rating === SegmentFeedback.RATING_DOWN) {
          feedback.rating = SegmentFeedback.RATING_UNDEFINED;
        } else {
          feedback.rating = SegmentFeedback.RATING_DOWN;
        }
        state.feedbacks[state.segmentIndex] = feedback;
        return {
          feedbacks: state.feedbacks,
          showFeedbackModal: feedback.rating === SegmentFeedback.RATING_DOWN,
        };
      },
      async () => {
        await DAO.updateSegmentFeedback(
          this.props.match.params.id,
          this.state.segmentIndex,
          this.getFeedback()
        );
        this.submitFeedback();
      }
    );
  }

  private onFeedbackModalDismissed() {
    this.setState(() => ({
      showFeedbackModal: false,
    }));
  }

  private onGoToBeginningClicked() {
    this.setShowEndOfTextAlert(false);
    this.goToIndex(0);
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

  private setFeedbackText(text: string) {
    let feedback = this.getFeedback();
    feedback.text = text;
    this.saveFeedback(feedback);
    DAO.updateSegmentFeedback(
      this.props.match.params.id,
      this.state.segmentIndex,
      feedback
    );
  }

  private setFeedbackCheckbox(checkboxId: string, value: boolean) {
    let feedback = this.getFeedback();
    feedback.checkboxes[checkboxId] = value;
    this.saveFeedback(feedback);
    DAO.updateSegmentFeedback(
      this.props.match.params.id,
      this.state.segmentIndex,
      feedback
    );
  }

  private saveFeedback(feedback: SegmentFeedback) {
    this.setState((state) => {
      let feedbacks = state.feedbacks;
      feedbacks[this.state.segmentIndex] = feedback;
      return {
        feedbacks: feedbacks,
      };
    });
  }

  private async submitFeedback(): Promise<void> {
    let data = {
      feedback: this.getFeedback(),
      url: window.location.href,
    };
    let response = await fetch(
      "https://7s5luj1r8f.execute-api.us-east-1.amazonaws.com/prod/feedbacks",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }

  private getFeedback(): SegmentFeedback {
    let feedback = this.state.feedbacks[this.state.segmentIndex]
      ? this.state.feedbacks[this.state.segmentIndex]!
      : new SegmentFeedback();
    return feedback;
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
        showFeedbackModal: false,
      }),
      this.updateTextStamps
    );
    if (!isLocalhost()) {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
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
