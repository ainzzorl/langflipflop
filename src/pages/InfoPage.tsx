import React from "react";

import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";

import "./InfoPage.css";

class InfoPage extends React.Component<{}, {}> {
  render() {
    return (
      <IonPage id="info-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle>About LangFlipFlop</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>
            LangFlipFlop is a lightweight app to practice translating from one
            language to another. Select a text from the list and read it one
            small fragment at a time. Try translating it in your head and then
            tap the text to compare your translation to ours. It's OK if the
            translation you had in mind doesn't match the suggestion - there can
            be more than one correct translation.
          </p>
          <p>
            LangFlipFlop doesn't exactly <i>teach</i> you the language, but lets
            you practice it on real-life examples. It works best for language
            learners who are somewhat comfortable with the language, but
            struggling to apply it when talking about certain topics.
          </p>
          <p>
            LangFlipFlop won't gamify your practice, won't ask you to register,
            won't collect any personal information, and won't bother you with
            notifications. Enjoy practicing your favorite language!
          </p>
        </IonContent>
      </IonPage>
    );
  }
}

export default InfoPage;
