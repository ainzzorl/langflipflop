import React from "react";

import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/react";

import {
  isBrowser,
  BROWSER_CLICK_VERB,
  DEVICE_CLICK_VERB,
} from "../common/Common";

import "./InfoPage.css";

class InfoPage extends React.Component<{}, {}> {
  render() {
    let links;
    let clickVerb;
    if (isBrowser()) {
      links = (
        <IonGrid>
          <IonRow className="ion-align-items-center store-links">
            <IonCol size="6">
              <a href="https://play.google.com/store/apps/details?id=com.langflipflop">
                <img
                  alt="Get it on Google Play"
                  src="assets/google-play-badge.png"
                />
              </a>
            </IonCol>
            <IonCol col-6>Coming soon on App Store.</IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <p className="content-text">
                <a href="mailto:langflipflop@gmail.com">Contact</a>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      );
      clickVerb = BROWSER_CLICK_VERB;
    } else {
      links = <div />;
      clickVerb = DEVICE_CLICK_VERB;
    }
    return (
      <IonPage id="info-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle>About LangFlipFlop</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent id="info-page-content">
          <p className="content-text">
            LangFlipFlop is a lightweight app to practice translating from one
            language to another. Select a text from the list and read it one
            small fragment at a time. Try translating it in your head and then{" "}
            {clickVerb} the text to compare your translation to ours. It's OK if
            the translation you had in mind doesn't match the suggestion - there
            can be more than one correct translation.
          </p>
          <p className="content-text">
            LangFlipFlop doesn't exactly <i>teach</i> you the language, but lets
            you practice it on real-life examples. It works best for language
            learners who are somewhat comfortable with the language, but
            struggling to apply it when talking about certain topics.
          </p>
          <p className="content-text">
            LangFlipFlop won't gamify your practice, won't ask you to register,
            won't collect any personal information, and won't bother you with
            notifications. Enjoy practicing your favorite language!
          </p>

          {links}
        </IonContent>
      </IonPage>
    );
  }
}

export default InfoPage;
