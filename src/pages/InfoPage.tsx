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
            <IonTitle>About Transapp</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>
            Transapp is a minimalistic app to practice translating from one
            language to another.
          </p>
          <p>
            Select a text from the list and read it one small fragment at a
            time. Try translating it in your head, and then tap the text to
            compare your translation with ours. Remember that there can be more
            than one correct translation.
          </p>
          <p>
            We won't <i>gamify</i> the process, won't ask you to register, won't
            collect any personal information, and won't bother you with push
            notification. Enjoy practicing your favorite language!
          </p>
        </IonContent>
      </IonPage>
    );
  }
}

export default InfoPage;
