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
import queryString from "query-string";
import React from "react";
import ReactCardFlip from "react-card-flip";
import ReactDOMServer from "react-dom/server";
import { RouteComponentProps } from "react-router-dom";
import { isBrowser } from "../common/Common";
import { DAO } from "../common/DAO";
import "./TextPage.css";

interface MyTextProps
  extends RouteComponentProps<{
    id: string;
  }> {}

class RecentPage extends React.Component<
  MyTextProps,
  {
    lang: string;
    lang1: string;
    lang2: string;
    texts: any;
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

    let url = this.props.location.search;
    if (!url) {
      url = window.location.search;
    }
    let params = queryString.parse(url);

    this.state = {
      // TODO: the defaults take place sometimes when user clicks back and forward.
      // This is not good generally.
      // If it happens somehow, we should default to the persistent state/prefs.
      lang: (params["lang1"] as string) || "en",
      lang1: (params["lang1"] as string) || "en",
      lang2: (params["lang2"] as string) || "es",
      segmentIndex: parseInt((params["i"] as string) || "1") - 1,
      texts: {},
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

    fetch("assets/data/texts/" + this.props.match.params.id + ".json")
      .then((res) => res.json())
      .then((texts) => {
        this.setState((state) => ({
          texts: texts,
          sideOneText: texts[state.lang1].segments[state.segmentIndex],
          sideTwoText: texts[state.lang2].segments[state.segmentIndex],
        }));
        this.updateTextStamps();
        return DAO.getUser();
      })
      .then((user) => {
        this.setState({
          showFtue: !user.completedTextFtue,
        });
      });
  }

  // TODO: generalize
  otherLang(lang: string): string {
    return lang === "en" ? "es" : "en";
  }

  componentDidUpdate() {
    if (this.state?.texts?.["en"]?.title) {
      document.title = this.state.texts["en"].title;
    }

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

  updateTextStamps() {
    let textId = this.props.match.params.id;
    DAO.updateTextStamps(textId, this.state.segmentIndex);
  }

  onFlip() {
    this.setState((state) => ({
      lang: this.otherLang(this.state.lang),
      flipped: !this.state.flipped,
    }));
  }

  goToNext() {
    this.goToIndex(this.state.segmentIndex + 1);
  }

  goToPrevious() {
    this.goToIndex(this.state.segmentIndex - 1);
  }

  onGoToTextInfoClicked() {
    this.props.history.push(
      `/texts/${this.props.match.params.id}/info${window.location.search}`
    );
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
    if (index >= this.state.texts["en"].segments.length) {
      this.setShowEndOfTextAlert(true);
      return;
    }
    this.setState(
      (state) => ({
        lang: state.lang1,
        segmentIndex: index,
        sideOneText: state.flipped
          ? state.texts[state.lang2].segments[index]
          : state.texts[state.lang1].segments[index],
        sideTwoText: state.flipped
          ? state.texts[state.lang1].segments[index]
          : state.texts[state.lang2].segments[index],
      }),
      this.updateTextStamps
    );
    if (window.history.replaceState) {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set("i", (index + 1).toString());
      var newURL =
        window.location.origin +
        window.location.pathname +
        "?" +
        searchParams.toString();
      window.history.replaceState({ path: newURL }, "", newURL);
    }
  }

  render() {
    if (!this.state.texts["en"] || this.state.segmentIndex < 0) {
      return <div>Loading...</div>;
    }

    let ftueMessage;
    if (isBrowser()) {
      ftueMessage = new IonicSafeString(
        ReactDOMServer.renderToString(
          <div>
            <p>
              Try translating the text you see on the screen and then click the
              text to see a possible translation.
            </p>
            <p>Click NEXT to go to the next screen.</p>
            <p>Click PREVIOUS to go to the previous screen.</p>
          </div>
        )
      );
    } else {
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
              <IonBackButton defaultHref="/" />
              <IonTitle color="medium">
                <div className="my-wrap">
                  {this.state.texts[this.state.lang].title} (
                  {this.state.segmentIndex + 1}/
                  {this.state.texts["en"].segments.length})
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
                  this.props.history.push("/t/texts");
                },
              },
              {
                text: "About Text",
                cssClass: "secondary",
                handler: this.onGoToTextInfoClicked,
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
                disabled={this.state.segmentIndex === 0}
                color="primary"
                onClick={this.goToPrevious}
              >
                Previous
              </IonButton>
              <IonButton
                disabled={
                  this.state.segmentIndex ===
                  this.state.texts["en"].segments.length - 1
                }
                color="secondary"
                onClick={this.goToNext}
              >
                Next
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton
                data-testid="go-to-text-info-button"
                onClick={this.onGoToTextInfoClicked}
              >
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
