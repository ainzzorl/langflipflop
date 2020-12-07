import React from "react";
import "./MainMenu.css";

import {
  IonContent,
  IonPage,
  IonLabel,
  IonItem,
  IonList,
  IonFooter,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
} from "@ionic/react";

import { home, bookmark, settings } from "ionicons/icons";

class MainMenu extends React.Component<{}, {}> {
  render() {
    return (
      <IonPage>
        <IonContent>
          <IonList>
            <IonItem routerLink="/texts/louis-ck-01">
              <IonLabel>Louis CK - 01</IonLabel>
            </IonItem>
            <IonItem routerLink="/texts/kaufmann-my-language-learning-technique">
              <IonLabel>Kaufmann - My Language Learning Technique</IonLabel>
            </IonItem>
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
            <IonItem routerLink="/texts/funny-dialogs">
              <IonLabel>Funny Dialogs</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons>
              <IonGrid>
                <IonRow>
                  <IonCol class="ion-text-center">
                    <IonButton fill="clear">
                      <IonIcon icon={home} size="large" />
                    </IonButton>
                  </IonCol>
                  <IonCol class="ion-text-center">
                    <IonButton fill="clear">
                      <IonIcon icon={bookmark} size="large" />
                    </IonButton>
                  </IonCol>
                  <IonCol class="ion-text-center">
                    <IonButton fill="clear">
                      <IonIcon icon={settings} size="large" />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}

export default MainMenu;
