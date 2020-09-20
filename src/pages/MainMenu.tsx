import React from "react";
import "./MainMenu.css";

import { IonContent, IonPage, IonLabel, IonItem, IonList } from "@ionic/react";

class MainMenu extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <IonPage>
        <IonContent>
          <IonList>
            <IonItem routerLink="/texts/hufflepuff-common-room">
              <IonLabel>Hufflepuff Common Room</IonLabel>
            </IonItem>
            <IonItem routerLink="/texts/owls">
              <IonLabel>Owls</IonLabel>
            </IonItem>
            <IonItem routerLink="/texts/daily-prophet">
              <IonLabel>Daily Prophet</IonLabel>
            </IonItem>
            <IonItem routerLink="/texts/every-country-has-ninjas">
              <IonLabel>Every Country Has Ninjas</IonLabel>
            </IonItem>
            <IonItem routerLink="/texts/platform-9">
              <IonLabel>Platform 9 3/4</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
}

export default MainMenu;
