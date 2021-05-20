import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import "./AboutPage.css";

class PageNotFoundPage extends React.Component<{}, {}> {
  render() {
    return (
      <IonPage id="info-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" data-testid="back-button" />
            </IonButtons>
            <IonTitle>Page not found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>Page not found.</p>
        </IonContent>
      </IonPage>
    );
  }
}

export default PageNotFoundPage;
