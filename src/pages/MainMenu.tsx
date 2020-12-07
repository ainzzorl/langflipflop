import React from "react";
import "./MainMenu.css";

import {
  IonContent,
  IonPage,
  IonLabel,
  IonFooter,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";

import { home, bookmark, settings } from "ionicons/icons";

class MainMenu extends React.Component<{}, {}> {
  render() {
    return (
      <IonPage>
        <IonContent>
          <IonCard button routerLink="/texts/louis-ck-01">
            <IonCardHeader>
              <IonCardTitle>
                <IonLabel>Louis CK - 01</IonLabel>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Difficulty: Foo</p>
              <p>Category: Bar</p>
              <p>Length: Car</p>
            </IonCardContent>
          </IonCard>

          <IonCard
            button
            routerLink="/texts/kaufmann-my-language-learning-technique"
          >
            <IonCardHeader>
              <IonCardTitle>
                <IonLabel>Kaufmann - My Language Learning Technique</IonLabel>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Difficulty: Foo</p>
              <p>Category: Bar</p>
              <p>Length: Car</p>
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/texts/hufflepuff-common-room">
            <IonCardHeader>
              <IonCardTitle>
                <IonLabel>Hufflepuff Common Room</IonLabel>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Difficulty: Foo</p>
              <p>Category: Bar</p>
              <p>Length: Car</p>
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/texts/owls">
            <IonCardHeader>
              <IonCardTitle>
                <IonLabel>Owls</IonLabel>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Difficulty: Foo</p>
              <p>Category: Bar</p>
              <p>Length: Car</p>
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/texts/daily-prophet">
            <IonCardHeader>
              <IonCardTitle>
                <IonLabel>Daily Prophet</IonLabel>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Difficulty: Foo</p>
              <p>Category: Bar</p>
              <p>Length: Car</p>
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/texts/every-country-has-ninjas">
            <IonCardHeader>
              <IonCardTitle>
                <IonLabel>Every Country Has Ninjas</IonLabel>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Difficulty: Foo</p>
              <p>Category: Bar</p>
              <p>Length: Car</p>
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/texts/platform-9">
            <IonCardHeader>
              <IonCardTitle>
                <IonLabel>Platform 9 3/4</IonLabel>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Difficulty: Foo</p>
              <p>Category: Bar</p>
              <p>Length: Car</p>
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/texts/funny-dialogs">
            <IonCardHeader>
              <IonCardTitle>
                <IonLabel>Funny Dialogs</IonLabel>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Difficulty: Foo</p>
              <p>Category: Bar</p>
              <p>Length: Car</p>
            </IonCardContent>
          </IonCard>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons>
              <IonGrid>
                <IonRow>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton fill="clear">
                        <IonIcon icon={home} size="large" />
                      </IonButton>
                      <br />
                      Home
                    </div>
                  </IonCol>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton fill="clear">
                        <IonIcon icon={bookmark} size="large" />
                      </IonButton>
                      <br />
                      My Texts
                    </div>
                  </IonCol>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton fill="clear">
                        <IonIcon icon={settings} size="large" />
                      </IonButton>
                      <br />
                      Settings
                    </div>
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
